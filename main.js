window.onload = function(){
   //document.getElementById('input').click();

// Create a new MutationObserver
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            const newElement = mutation.addedNodes[0];
            if (newElement && newElement.classList.contains('display__line')) {
                setTimeout(() => {
                    const lines = Array.from($display.getElementsByClassName('display__line'));
                    const target = lines.reduce((total, line) => total + line.offsetHeight, 0);
                    smoothScrollTo(target);
                }, 50); // Adjust delay as needed
            }
        }
    });
});

// Start observing the container element for changes in its child list
const $display = document.getElementById('display');
observer.observe($display, { childList: true });

// Smooth scrolling function
function smoothScrollTo(target) {
    const start = $display.scrollTop;
    const change = target - start;
    const duration = 1000; // Duration in ms, adjust as needed
    let startTime = null;

    function animateScroll(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const next = easeInOutQuad(timeElapsed, start, change, duration);
        $display.scrollTop = next;
        if (timeElapsed < duration) requestAnimationFrame(animateScroll);
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animateScroll);
}
};

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

    themeColors = [avg, light, lighter, dark, sat, desat];

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

// Function to generate a gradient array
function generateGradient(startColor, endColor, steps) {
    var start = {
        'R'     : parseInt(startColor.slice(1,3), 16),
        'G'     : parseInt(startColor.slice(3,5), 16),
        'B'     : parseInt(startColor.slice(5,7), 16)
    }
    var end = {
        'R'     : parseInt(endColor.slice(1,3), 16),
        'G'     : parseInt(endColor.slice(3,5), 16),
        'B'     : parseInt(endColor.slice(5,7), 16)
    }
    diffR = end['R'] - start['R'];
    diffG = end['G'] - start['G'];
    diffB = end['B'] - start['B'];

    stepsHex  = new Array();
    for(var i = 0; i < steps; i++) {
        var diffRed = start['R'] + ((diffR / steps) * i);
        var diffGreen = start['G'] + ((diffG / steps) * i);
        var diffBlue = start['B'] + ((diffB / steps) * i);
        stepsHex[i] = '#' + Math.round(diffRed).toString(16).padStart(2, '0') + Math.round(diffGreen).toString(16).padStart(2, '0') + Math.round(diffBlue).toString(16).padStart(2, '0');
    }
    return stepsHex;
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

    getPath: (path) => {
        const parts = path.split('/').filter(Boolean); // filter out empty strings
        let currentPath = '';
        for (let part of parts) {
            currentPath += '/' + part;
            if (!(currentPath in cmd.fileSystem)) {
                return null;
            }
        }
        return { node: cmd.fileSystem[currentPath], path: currentPath };
    },

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
        echo: {
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
            response: (linesToClear) => {
                let lines = Array.from(document.getElementsByClassName('display__line'));
                linesToClear = Number(linesToClear); // convert linesToClear to a number
                if (isNaN(linesToClear)) { // if linesToClear is not a number, remove all lines
                    for (let d = lines.length - 1; d >= 0; d--) {
                        lines[d].parentNode.removeChild(lines[d]);
                        console.log('NO PARAMETER PASSED | Removed line ' + d)
                    }
                } else { // if linesToClear is a number, remove that many lines from the end
                    let stop = lines.length - linesToClear - 1; // calculate stopping condition before the loop
                    for (let d = lines.length - 1; d > stop - 1; d--) {
                        if (d >= 0) { // Check if the index is valid
                            lines[d].parentNode.removeChild(lines[d]);
                            console.log('Removed line ' + d)
                        }
                    }
                }
            },
            whatIs: 'Remove all the previous lines.'
        },
        randomize: {
            type: 'function',
            response: () => {
                refreshImage("bg", "https://picsum.photos/1920/1080")
                if (img.complete) {
                    let lines = document.getElementsByClassName('display__line');
                    for (d = lines.length - 1; d >= 0; d--) {
                        lines[d].parentNode.removeChild(lines[d]);
                    }
                    cmd.launch();
                    setTheme();
                } else {
                    img.addEventListener('load', function() {
                        let lines = document.getElementsByClassName('display__line');
                        for (d = lines.length - 1; d >= 0; d--) {
                            lines[d].parentNode.removeChild(lines[d]);
                        }
                        cmd.launch();
                    setTheme();
                    });
                }
                console.log(document.getElementById("bg").src);
            },
            whatIs: 'Randomizes the style of the page.'
        },
        neofetch: {
            type: 'function',
            response: async () => {
                const getGeoLocation = async () => {
                    const response = await fetch('https://geo.ipify.org/api/v1?apiKey=at_DAABotPF5TXSbLRIz2NSoKXbuG1w2');
                    const data = await response.json();
                    return data;
                };
        
                let location;
                try {
                    location = await getGeoLocation();
                } catch (error) {
                    console.log('Error occurred: ' + error.message);
                }

                const lines = [
'                             .oodMMMM',
'                    .oodMMMMMMMMMMMMM',
'        ..oodMMM  MMMMMMMMMMMMMMMMMMM',
'  oodMMMMMMMMMMM  MMMMMMMMMMMMMMMMMMM',
'  MMMMMMMMMMMMMM  MMMMMMMMMMMMMMMMMMM',
'  MMMMMMMMMMMMMM  MMMMMMMMMMMMMMMMMMM',
'  MMMMMMMMMMMMMM  MMMMMMMMMMMMMMMMMMM',
'  MMMMMMMMMMMMMM  MMMMMMMMMMMMMMMMMMM',
'  MMMMMMMMMMMMMM  MMMMMMMMMMMMMMMMMMM',
'  ',
'  MMMMMMMMMMMMMM  MMMMMMMMMMMMMMMMMMM',
'  MMMMMMMMMMMMMM  MMMMMMMMMMMMMMMMMMM',
'  MMMMMMMMMMMMMM  MMMMMMMMMMMMMMMMMMM',
'  MMMMMMMMMMMMMM  MMMMMMMMMMMMMMMMMMM',
'  MMMMMMMMMMMMMM  MMMMMMMMMMMMMMMMMMM',
'  `^^^^^^MMMMMMM  MMMMMMMMMMMMMMMMMMM',
'        ````^^^^  ^^MMMMMMMMMMMMMMMMM',
'                       ````^^^^^^MMMM',
                ];

                const avg = chroma(colorThief.getColor(img)).brighten().hex();
                const light = chroma(avg).brighten(1).hex();
                const lighter = chroma(avg).brighten(2).hex();
                const dark = chroma(avg).darken(2).hex();
                const sat = chroma(avg).saturate(2).brighten(1.5).hex();
                const desat = chroma(avg).desaturate().hex();

                let themeColors = [avg, light, lighter, dark, sat, desat];

                const boxes = themeColors.map(color => {
                    return `<span style="color: ${color};">███</span>`;
                }).join('');

                const text = [
                    
                    ' ',
                    ' ',
                    ' ',
                    ' ',
                    ' ',
                    '   Browser: ' + navigator.userAgent.split(")")[0] + ')',
                    '   Platform: ' + navigator.platform,
                    '   Language: ' + navigator.language,
                    '   # of Cores: ' + navigator.hardwareConcurrency,
                    '',
                    '   Memory Allocated: ' + navigator.deviceMemory + ' GiB',
                    location ? '   Latitude: ' + location.location.lat : '   Could not get latitude',
                    location ? '   Longitude: ' + location.location.lng : '   Could not get longitude',
                    '   IP Address: ' + location.ip,
                    ' ',
                    '   ' + boxes, // Add colored boxes
                    ' ',
                    ' ',
                ];

                const startColor = chroma(avg).saturate(2).brighten(1.5).hex();
                const endColor = chroma(avg).saturate(2).brighten(-1).hex();
                let coloredText = '';
        const totalLength = lines.reduce((total, line) => total + line.length, 0);
        const gradient = generateGradient(startColor, endColor, totalLength);
        let gradientIndex = 0;
        for(let j = 0; j < lines.length; j++) {
            for(let i = 0; i < lines[j].length; i++) {
                coloredText += `<span style="color: ${gradient[gradientIndex]}">${lines[j][i]}</span>`;
                gradientIndex++;
            }
            coloredText += ' ' + text[j] + '<br>'; // Add the corresponding text
        }

        const coloredLines = coloredText.split('<br>');
        cmd.generate('‎');
        coloredLines.forEach(line => {
            cmd.generate(line);
        });
        cmd.generate('‎');
    },
    whatIs: 'Displays System Information'
        },
        date: {
            type: 'function',
            response: () => {
                const date = new Date();
                cmd.generate('‎');
                cmd.generate(date.toString());
            },
            whatIs: 'Prints the current date and time.'
        },
        sites: {
            type: 'function',
            response: () => {
                const sites = ['https://skylar.cafe', 'https://skywur.cc', 'https://your.site'];
                const siteInfo = [
                    [
                        ' ',
                        'as you\'ve probably noticed, skylar.cafe is the site you\'re currently on!',
                        'i made this site after seeing several other very pretty',
                        '(although basic) CLI sites just like it',
                        'feel free to stay a while :)',
                        ' ',
                    ],
                    [
                        ' ',
                        'this is my main personal site :3',
                        'it has my most current links, projects, and creating it taught me a lot.',
                        'i\'ve gone through quite a few versions of it, and it\'s likely that the version',
                        'you see now is not the same as the one i\'m looking at while writing this',
                        ' ',
                    ],
                    [
                        '',
                        'do you have a website? no?? why not??',
                        'sites aren\'t just for big businesses or developers', 
                        'they\'re for anyone who wants to distinguish themselves!!',
                        ' ',
                        'if you\'re interested in a commission, or just have a cool idea, i\'d love to hear about it.',
                        'you can reach me thru any of my socials, they\'re easy to find <3',
                        ' ',
                    ]
                ];
                let currentIndex = 0;
        
                let linesGenerated = 0;

                function displaySite(index) {
                    cmd.commands.clear.response(linesGenerated - 1); // Clear the last lines generated
                    linesGenerated = 0; // Reset the counter
                
                    cmd.generate('┌───────────────────────────────────────────────────────────────────────────────────────────────┐');
                    linesGenerated++;
                
                    let site = sites[index];
                    if (site.length < 86) {
                        site += ' '.repeat(86 - site.length);
                    }
                
                    cmd.generate(`│(${index + 1}) <==  ${site}│`);
                    linesGenerated++;
                
                    cmd.generate('├───────────────────────────────────────────────────────────────────────────────────────────────┤');
                    linesGenerated++;
                
                    siteInfo[index].forEach(line => {
                        let text = line.trim();
                        let paddingSize = (95 - text.length) / 2;
                        let padding = ' '.repeat(Math.floor(paddingSize));
                        let extraSpace = paddingSize % 1 === 0 ? '' : ' ';
                        cmd.generate(`│${padding}${text}${padding}${extraSpace}│`);
                        linesGenerated++;
                    }); // Display the ASCII art for the site
                
                    cmd.generate('├───────────────────────────────────────────────────────────────────────────────────────────────┤');
                    linesGenerated++;
                
                    cmd.generate('│       (1) Previous           |            (2) Next            |            (3) Exit           │');
                    linesGenerated++;
                
                    cmd.generate('└───────────────────────────────────────────────────────────────────────────────────────────────┘');
                    linesGenerated++;
                }
        
                displaySite(currentIndex);
        
                function handleKeypress(event) {
                    event.preventDefault(); // Prevent the keypress from being entered into the input
                    if (event.key === '1') {
                        currentIndex = (currentIndex - 1 + sites.length) % sites.length;
                        displaySite(currentIndex);
                    } else if (event.key === '2') {
                        currentIndex = (currentIndex + 1) % sites.length;
                        displaySite(currentIndex);
                    } else if (event.key === '3') {
                        document.removeEventListener('keypress', handleKeypress); // Remove the event listener
                        cmd.commands.clear.response(linesGenerated - 1); // Clear the last lines generated
                    }
                }
        
                document.addEventListener('keypress', handleKeypress);
            },
            whatIs: 'Print out text.'
        },
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
        const startText = ['skylar.cafe [Version 1.0.0]',
            '(c) 2022 skywur.cc. All rights reserved.',
            'Last login: ' + new Date().toLocaleString(),
            '‎',
            'Type "help" to get a list of available commands.',
            '‎'
        ];

        for (t = 0; t < startText.length; t++) {
            cmd.generateStart(startText[t]);
        }

    },

    

// Modified generate function
generate: (text, startColor, endColor) => {
    const $display = document.getElementById('display');
    const $typer = document.getElementById('typer');
    let div = document.createElement('div');
    div.classList.add('display__line');
    div.setAttribute("id", "display__line");

    // Add animation delay
    const lines = document.querySelectorAll('.display__line');
    div.style.animationDelay = `${lines.length * 0.01}s`;

    let colors;
    if (startColor && endColor) {
        colors = generateGradient(startColor, endColor, text.length);
    }

    let str = '';
    for(let i = 0; i < text.length; i++) {
        if(colors && colors[i]) {
            str += '<span style="color: ' + colors[i] + '">' + text[i] + '</span>';
        } else {
            str += text[i];
        }
    }

    div.innerHTML = str;
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
    $input.style.direction = 'ltr';
    let historyIndex = cmd.history.length;

    $input.addEventListener('keydown', function(e) {
        if (e.which === 9) { // Tab key
            e.preventDefault();
            const currentInput = this.value.trim();
            const commands = Object.keys(cmd.commands);
            for (let i = 0; i < commands.length; i++) {
                if (commands[i].startsWith(currentInput)) {
                    this.value = commands[i];
                    break;
                }
            }
        }
    });
    
        $input.addEventListener('keyup', function(e) {
            if (e.which === 13) { // Enter key
                e.preventDefault();
                cmd.responsiveInput(true);
                cmd.callCommand(this.value);
                cmd.history.push(this.value);
                this.value = '';
                historyIndex = cmd.history.length;
            }
    
            if (e.which === 38) { // Up arrow key
                if (historyIndex > 0) historyIndex--;
                $input.value = cmd.history[historyIndex] || '';
                $input.dispatchEvent(new Event('input')); // Trigger input event
            }
    
            if (e.which === 40) { // Down arrow key
                if (historyIndex < cmd.history.length) historyIndex++;
                $input.value = cmd.history[historyIndex] || '';
                $input.dispatchEvent(new Event('input')); // Trigger input event
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
                    case 'echo':
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