const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

console.log('start');

app.on('will-finish-launching', () => {
    console.log('will-finish-launching');
});

app.on('ready', (launchInfo) => {
    console.log(`ready : ${JSON.stringify(launchInfo)}`);

    mainWindow = new BrowserWindow({width: 600, height: 600});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    secondWindow = new BrowserWindow({
        width: 300,
        height: 300,
        x: 10,
        y: 10,
        resizable: false,
        movable: false,
        title: 'pop'
    });

    secondWindow.loadURL(`file://${__dirname}/pop.html`);
    secondWindow.once('ready-to-show', () => {
        secondWindow.show();
    });

    child = new BrowserWindow({
        width: 300,
        height: 300,
        parent: mainWindow,
        modal: true,
        show: false
    });

    child.loadURL(`file://${__dirname}/child.html`);
    child.once('ready-to-show', () => {
        child.show();
    });
});

app.on('window-all-closed', () => {
    /*
     모든 윈도우가 닫히자 마자 불립니다.
     */
    console.log('window-all-closed');
    app.quit();
});

app.on('before-quit', (event) => {
    /*
     앱 종료가 시작되어서 앱의 모든 윈도우들을 클로즈 하기 시작할때 불립니다.
     이미 닫혀있어도 불립니다.
     */
    // event.preventDefault();
    console.log('before-quit');
});

app.on('will-quit', (event) => {
    /*
     모든 윈도우가 닫히고 나서 메인 앱 프로세스를 종료하기 직전에 불립니다.
     */
    // event.preventDefault();
    console.log('will-quit');
});

/*
 window-all-closed 와 will-quit 차이
 만약에 window-all-closed 이벤트를 받는 함수를 설정하지 않으면, 모든 윈도우들이 닫혔을때 app.quit() (before-quit => will-quit => quit) 이 진행됩니다.
 만약에 window-all-closed 이벤트를 받는 함수를 설정 한다면, app.quit() 을 할지 안할지 결정할 수 있습니다.

 모든 윈도우를 닫아서가 아니라, <Cmd + Q> 를 호출하거나, 코드에서 직접 app.quit() 을 호출해서 앱을 종료하면,
 모든 윈도우를 닫은 후 will-quit 이벤트를 발생시킨다.
 이럴 경우에는 window-all-closed 이벤트는 발생하지 않는다.
 */

app.on('quit', (event, exitCode) => {
    /*
     최종적으로 종료되면서 불립니다.
     */
    console.log(`quit : ${exitCode}`);
});

/*
    [macOS]
    dock 에서 어플리케이션 아이콘을 클릭하면 발생하는 이벤트
 */
app.on('activate', (event, hasVisibleWindows) => {
    /*
     열려있는 윈도우가 있으면, hasVisibleWindows 가 true 입니다.
     없으면, hasVisibleWindows 가 false 입니다.
     */
    console.log(`activate : ${hasVisibleWindows}`);

    /*if (!hasVisibleWindows) {
        mainWindow.show();
    }*/
});