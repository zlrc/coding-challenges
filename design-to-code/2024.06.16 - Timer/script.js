class Component extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    hydrate(elementName) {
        const { shadowRoot } = this;
        const template = document.getElementById(elementName);
        const node = document.importNode(template.content, true);
        shadowRoot.appendChild(node);
    }

    connectedCallback() {
        this.hydrate(this.constructor.name);
        this.onMount();
    }

    disconnectedCallback() {
        this.onUnmount();
    }

    onMount() { }
    onUnmount() { }
}


class CircleButton extends Component {
    static name = 'circle-btn';
}


class NavButton extends Component {
    static name = 'nav-btn';
}


function register(element) {
    customElements.define(element.name, element);
}
register(CircleButton);
register(NavButton)


/* ------------ */


const timerEl = document.getElementsByClassName("timer")[0];
const timeLeftEl = document.getElementsByClassName("timer__time-left")[0];

let timerDuration = 2370; // in seconds
let timeLeft = 1564;
let progress = 1 - ((timeLeft) / timerDuration).toFixed(2);


function formatTime(seconds) {
    const h = Math.floor(seconds / 3600); // hours
    const m = Math.floor(seconds / 60) - h * 60; // minutes
    const s = seconds - (m * 60) - (h * 3600); // seconds
    const pad = (x) => String(x).padStart(2, '0'); // e.g. "1" becomes "01"
    if (h > 0)
        return `${h}:${pad(m)}:${pad(s)}`; // H:MM:SS
    if (m > 0)
        return `${m}:${pad(s)}`; // M:SS
    return `${s}`; // S
}


function updateTimer() {
    timeLeftEl.innerHTML = formatTime(timeLeft);
    timerEl.style.setProperty("--progress", Math.min(1, progress));
}


function decrementTimer() {
    timeLeft--;
    progress = 1 - ((timeLeft - 1) / timerDuration).toFixed(2); // done like this so that the progress bar moves before the time changes.
    updateTimer();
}


function loop() {
    if (timeLeft <= 0)
        return;
    decrementTimer();
    setTimeout(loop, 1000);
}


(() => {
    updateTimer();
    setTimeout(loop, 1000);
})();