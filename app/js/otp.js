window.EasyLips = window.EasyLips || {};

(function (App) {
  App.bindOtpInput = function bindOtpInput(root, { onComplete } = {}) {
    const inputs = [...root.querySelectorAll(".otp-digit")];
    if (!inputs.length) return;

    function focusAt(index) {
      const input = inputs[index];
      if (input) {
        input.focus();
        input.select();
      }
    }

    function setValue(input, value) {
      input.value = value;
      input.classList.toggle("otp-digit--filled", value.length > 0);
    }

    function getCode() {
      return inputs.map((input) => input.value).join("");
    }

    function notifyComplete() {
      const code = getCode();
      if (code.length === inputs.length) {
        onComplete?.(code);
      }
    }

    inputs.forEach((input, index) => {
      input.addEventListener("focus", () => {
        inputs.forEach((item) => item.classList.remove("otp-digit--active"));
        input.classList.add("otp-digit--active");
      });

      input.addEventListener("blur", () => {
        input.classList.remove("otp-digit--active");
      });

      input.addEventListener("input", () => {
        const digit = input.value.replace(/\D/g, "").slice(-1);
        setValue(input, digit);

        if (digit && index < inputs.length - 1) {
          focusAt(index + 1);
        }

        notifyComplete();
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && !input.value && index > 0) {
          event.preventDefault();
          setValue(inputs[index - 1], "");
          focusAt(index - 1);
          return;
        }

        if (event.key === "ArrowLeft" && index > 0) {
          event.preventDefault();
          focusAt(index - 1);
          return;
        }

        if (event.key === "ArrowRight" && index < inputs.length - 1) {
          event.preventDefault();
          focusAt(index + 1);
        }
      });

      input.addEventListener("paste", (event) => {
        event.preventDefault();
        const pasted = event.clipboardData
          .getData("text")
          .replace(/\D/g, "")
          .slice(0, inputs.length);

        pasted.split("").forEach((digit, offset) => {
          setValue(inputs[offset], digit);
        });

        focusAt(Math.min(pasted.length, inputs.length - 1));
        notifyComplete();
      });
    });

    return {
      focus() {
        const firstEmpty = inputs.findIndex((input) => !input.value);
        focusAt(firstEmpty === -1 ? inputs.length - 1 : firstEmpty);
      },
      getCode,
      clear() {
        inputs.forEach((input) => setValue(input, ""));
        focusAt(0);
      },
    };
  };

  App.bindResendTimer = function bindResendTimer(root, {
    duration = 24,
    onResend,
  } = {}) {
    const button = root.querySelector(".resend-link");
    const timer = root.querySelector(".resend-timer");
    if (!button || !timer) return;

    let remaining = duration;
    let intervalId = null;

    function formatTime(seconds) {
      const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
      const secs = String(seconds % 60).padStart(2, "0");
      return `${mins}:${secs}`;
    }

    function sync() {
      timer.textContent = formatTime(remaining);
      button.disabled = remaining > 0;
      button.classList.toggle("resend-link--disabled", remaining > 0);
    }

    function stop() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function start() {
      stop();
      remaining = duration;
      sync();

      intervalId = window.setInterval(() => {
        remaining -= 1;
        sync();

        if (remaining <= 0) {
          stop();
        }
      }, 1000);
    }

    button.addEventListener("click", () => {
      if (button.disabled) return;
      onResend?.();
      start();
    });

    start();

    return { restart: start, stop };
  };
})(window.EasyLips);
