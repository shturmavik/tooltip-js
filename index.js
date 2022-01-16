(function() {
    class Tooltip {
        constructor() {
            this.el = document.createElement('div');
            this.el.style.position = 'absolute';

            this.el.classList.add(this.name);
            this.el.classList.toggle(`${this.name}_active`, false);
            document.body.appendChild(this.el);

            this.onHide = this.onHide.bind(this);
            this.listeners = [];
        }

        get name() {
            return 'tooltip';
        }

        get indent() {
            return 5;
        }

        delegate(eventName, element, cssSelector, callback) {
            const fn = event => {
                if (!event.target.matches(cssSelector)) {
                    return;
                }

                callback(event);
            };

            element.addEventListener(eventName, fn);
            this.listeners.push({fn, element, eventName});

            return this;
        }

        onShow = (event) => {
            const {target} = event;
            this.el.innerHTML = target.dataset.tooltip;
            this.el.classList.toggle(`${this.name}_active`, true);

            const sourceElRect = target.getBoundingClientRect();
            const elRect = this.el.getBoundingClientRect();

            let top = sourceElRect.bottom + this.indent;
            const left = sourceElRect.left;

            if (top + elRect.height > document.documentElement.clientHeight) {
                top = sourceElRect.top - elRect.height - this.indent;
            }

            this.el.style.top = `${top + window.scrollY}px`;
            this.el.style.left = `${left + window.scrollX}px`;
        };

        onHide() {
            this.el.classList.toggle(`${this.name}_active`, false);
        }

        attach(root) {
            this.delegate('mouseover', root, '[data-tooltip]', this.onShow).
                delegate('mouseout', root, '[data-tooltip]', this.onHide);
        }

        detach() {
            for (const {fn, element, eventName} of this.listeners) {
                element.removeEventListener(eventName, fn);
            }
        }
    }

    window.Tooltip = Tooltip;
})();

const tooltip = new Tooltip();
tooltip.attach(document.body);
//tooltip.detach();
