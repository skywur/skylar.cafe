//$TODO retype last input on up arrow keypress


function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function hexToRGB(h, a) {
    let r = 0,
        g = 0,
        b = 0;

    // 3 digits
    if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];
        a = a;

        // 6 digits
    } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
        a = a;
    }

    return +r + "," + +g + "," + +b;
}

const colorThief = new ColorThief();
const img = document.querySelector('img');

// Make sure image is finished loading
if (img.complete) {
    setTheme();
} else {
    img.addEventListener('load', function() {
        setTheme();
    });
}

function setTheme() {
    const avg = chroma(colorThief.getColor(img)).brighten().hex();
    const light = chroma(avg).brighten(1).hex();
    const lighter = chroma(avg).brighten(2).hex();
    const dark = chroma(avg).darken(2).hex();
    const sat = chroma(avg).saturate(2).brighten(1.5).hex();
    const desat = chroma(avg).desaturate().hex();

    document.documentElement.style.setProperty('--main', hexToRGB(dark));
    document.documentElement.style.setProperty('--selection', desat);
    document.documentElement.style.setProperty('--scrollbar-track-and-corner', avg);
    document.documentElement.style.setProperty('--scrollbar-thumb', desat);
    document.documentElement.style.setProperty('--start-text', sat);
    document.documentElement.style.setProperty('--console-text', lighter);
    document.documentElement.style.setProperty('--text-main', light);
    document.documentElement.style.setProperty('--text-alt', 'white');
}

function refreshImage(imgElement, imgURL) {
    // create a new timestamp 
    var timestamp = new Date().getTime();

    var el = document.getElementById(imgElement);

    var queryString = "?t=" + timestamp;

    el.src = imgURL + queryString;
}




const cmd = {
    init: () => {
        cmd.launch();
        cmd.typer();
        cmd.focusInput();
        cmd.responsiveInput(false);
    },

    responsiveInput: (clear) => {
        const $span = document.getElementsByClassName('length-span')[0];
        const $input = document.getElementById('input');
        $input.addEventListener('input', function(e) {
            var width = $span.getBoundingClientRect().width;
            $span.innerHTML = $input.value.split(' ').join('&nbsp;');
            $input.style.width = $span.getBoundingClientRect().width + 'px';
        });

        if (clear) {
            $input.style.width = '0px';
            $span.textContent = '';
            clear = false;
        }
    },

    history: [],

    commands: {
        help: {
            type: 'function',
            response: () => {
                cmd.generate('‎')
                const commds = cmd.commands;
                const cmdLen = Object.keys(commds).length;
                for (c = 0; c < cmdLen; c++) {
                    const name = Object.keys(commds)[c];
                    const what = cmd.commands[name].whatIs;
                    cmd.generate('# ' + name + ' - ' + what);


                }
            },
            whatIs: 'This displays all of the commands and what they do.'
        },
        links: {
            type: 'function',
            response: () => {
                cmd.generate2('Twitter', 'https://twitter.com/skywurrr')
                cmd.generate2('Steam', 'https://steamcommunity.com/id/skywur/')
                cmd.generate2('Pronouns.page', 'https://en.pronouns.page/@skywur')
                cmd.generate2('skywur.cc', 'https://skywur.cc')
            },
            whatIs: 'Links my socials.'
        },
        print: {
            type: 'function',
            response: (message) => {
                if (message.length == 0) {
                    message = 'You need to specify something after print.'
                }
                cmd.generate('‎'),
                    cmd.generate(message);
            },
            whatIs: 'Print out text.'
        },
        clear: {
            type: 'function',
            response: () => {
                let lines = document.getElementsByClassName('display__line');
                for (d = lines.length - 1; d >= 0; d--) {
                    lines[d].parentNode.removeChild(lines[d]);
                }
            },
            whatIs: 'Remove all the previous lines.'
        },
        randomize: {
            type: 'function',
            response: () => {
                refreshImage("bg", "https://picsum.photos/1920/1080")
                if (img.complete) {
                    setTheme();
                } else {
                    img.addEventListener('load', function() {
                        setTheme();
                    });
                }
                console.log(document.getElementById("bg").src);
            },
            whatIs: 'Randomizes the style of the page.'
        }
    },

    focusInput: () => {
        const $input = document.getElementsByClassName('display__input')[0];
        document.getElementById('display').addEventListener('click', () => {
            focusIt();
        });

        function focusIt() {
            $input.focus();
            $input.value = $input.value;
        }
    },

    launch: () => {
        const $display = document.getElementById('display');
        const startText = ['skylar.cafe [Version 0.0.1]',
            '(c) 2022 skywur.cc. All rights reserved.',
            '‎',
            'Get started by running the help command.',
            '‎'
        ];

        for (t = 0; t < startText.length; t++) {
            cmd.generateStart(startText[t]);
        }

    },

    generate: (text, text2) => {
        const $display = document.getElementById('display');
        const $typer = document.getElementById('typer');
        let div = document.createElement('div');
        div.classList.add('display__line');

        var mapObj = {
            "-": '<span style="color: white">-</span>',
            "#": '<span style="color: white">#</span>'
        };

        let str = text.replace(/-|#/gi, function(matched) {
            return mapObj[matched];
        });

        div.innerHTML = str;
        $display.insertBefore(div, $typer);

        div.style.color = text2;


    },
    generate2: (text, text2) => {
        const $display = document.getElementById('display');
        const $typer = document.getElementById('typer');
        let a = document.createElement('a');
        a.classList.add('display__line');
        a.setAttribute("id", "link");
        a.textContent = text;
        var link = document.createTextNode("");
        a.appendChild(link);
        a.href = text2;
        $display.insertBefore(a, $typer);
    },
    generateStart: (text) => {
        const $display = document.getElementById('display');
        const $typer = document.getElementById('typer');
        let div = document.createElement('div');
        div.classList.add('display__line');
        div.setAttribute("id", "start");
        div.textContent = text;

        $display.insertBefore(div, $typer);
    },

    typer: () => {
        const $input = document.getElementsByClassName('display__input')[0];
        let count = cmd.history.length;
        let historyChoice;

        $input.addEventListener('keyup', function(e) {
            // cmd.responsiveInput(this.value);
            if (e.which === 13) {
                e.preventDefault();

                cmd.responsiveInput(true);
                cmd.callCommand(this.value);
                cmd.history.push(this.value);
                this.value = '';
                count = cmd.history.length;
            }

            // 38 up
            // 40 down
            if (e.which === 38) {
                if (count > 0) count--;
                (count == cmd.history.length + 1) ? historyChoice = '': historyChoice = cmd.history[count];

                $input.textContent = historyChoice;
            }

            if (e.which === 40) {
                if (count < cmd.history.length) count++;
                (count == cmd.history.length + 1) ? historyChoice = '': historyChoice = cmd.history[count];

                $input.textContent = historyChoice;
            }
        });
    },

    callCommand: (command) => {
        // find actual command, e.g. 'print say something!!' it will find 'print'
        const cmmd = command.split(' ')[0];
        // anything after the command.
        const params = command.replace(cmmd, '');

        // does it exist!?
        if (cmd.commands[cmmd] != null) {
            // our command details
            const obj = cmd.commands[cmmd];

            // what type of command are we dealing with?
            if (obj.type == 'string') {
                // print it!!
                cmd.generate(cmd.commands[cmmd].response);

            } else if (obj.type == 'function') {
                switch (cmmd) {
                    case 'print':
                        cmd.commands[cmmd].response(params);
                        break;
                        // add cases in when needed.
                    default:
                        cmd.commands[cmmd].response();
                }
            }

        } else {
            // it doesn't exist! :'(
            cmd.generate(command + ' is not a valid command.');

        }
    }
}

cmd.init();


//drag

(function($) {

    $(window).on('load', function() {
        console.log("everything loaded");

        const wrapper = document.getElementById("wrapper");
        wrapper.style.opacity = "0";
        wrapper.addEventListener('transitionend', () => wrapper.remove());

    });

    // and/or

    $(document).ready(function() {
        console.log("dom loaded");
    });

})(jQuery);