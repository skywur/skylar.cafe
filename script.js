function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function setTheme() {
    const bg = randomIntFromInterval(1, 4)
    if (bg == 1) {
        document.documentElement.style.setProperty('--main', '41, 6, 39');
        document.documentElement.style.setProperty('--selection', '#81387f');
        document.documentElement.style.setProperty('--scrollbar-track-and-corner', 'rgba(22, 3, 21, 0.4)');
        document.documentElement.style.setProperty('--scrollbar-thumb', 'rgba(211, 34, 202, 0.3)');
        document.documentElement.style.setProperty('--console-text', '#A2C7E5');
        document.documentElement.style.setProperty('--text-main', '#d580e6');
        document.documentElement.style.setProperty('--text-alt', '#ffffff');
        document.body.style.backgroundImage = "url('bg1.jpg')";
    } else if (bg == 2) {
        document.documentElement.style.setProperty('--main', '28, 11, 0');
        document.documentElement.style.setProperty('--selection', '#8a362b');
        document.documentElement.style.setProperty('--scrollbar-track-and-corner', 'rgba31, 12, 0, 0.4)');
        document.documentElement.style.setProperty('--scrollbar-thumb', 'rgba(79, 31, 0, 0.3)');
        document.documentElement.style.setProperty('--console-text', '#ff5e00');
        document.documentElement.style.setProperty('--text-main', '#c70000');
        document.documentElement.style.setProperty('--text-alt', '#ffffff');
        document.body.style.backgroundImage = "url('bg2.jpg')";
    } else if (bg == 3) {
        document.documentElement.style.setProperty('--main', '10, 28, 4');
        document.documentElement.style.setProperty('--selection', '#6ab072');
        document.documentElement.style.setProperty('--scrollbar-track-and-corner', 'rgba(5, 38, 11, 0.4)');
        document.documentElement.style.setProperty('--scrollbar-thumb', 'rgba(10, 79, 22, 0.3)');
        document.documentElement.style.setProperty('--console-text', '#3cfaa8');
        document.documentElement.style.setProperty('--text-main', '#3ee652');
        document.documentElement.style.setProperty('--text-alt', '#ffffff');
        document.body.style.backgroundImage = "url('bg3.jpg')";
    } else {
        document.documentElement.style.setProperty('--main', '25, 13, 48');
        document.documentElement.style.setProperty('--selection', '#81387f');
        document.documentElement.style.setProperty('--scrollbar-track-and-corner', 'rgba(22, 3, 21, 0.4)');
        document.documentElement.style.setProperty('--scrollbar-thumb', 'rgba(211, 34, 202, 0.3)');
        document.documentElement.style.setProperty('--console-text', '#d47e72');
        document.documentElement.style.setProperty('--text-main', '#865bf5');
        document.documentElement.style.setProperty('--text-alt', '#ffffff');
        document.body.style.backgroundImage = "url('bg4.jpg')";
    }
}

window.onload = function() {
    setTheme();
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
                    cmd.generate(name + ' - ' + what);

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
                setTheme();
                cmd.generate('‎')
                cmd.generate('Theme randomized.')
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
            cmd.generate(startText[t]);
        }

    },

    generate: (text) => {
        const $display = document.getElementById('display');
        const $typer = document.getElementById('typer');
        let div = document.createElement('div');
        div.classList.add('display__line');
        div.textContent = text;

        $display.insertBefore(div, $typer);
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