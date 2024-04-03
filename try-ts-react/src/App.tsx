import "./App.css";
import {ConfigProvider, useMessage} from './Message'

function Test() {
    const message = useMessage();
    return <button onClick={() => message.add({content: '123'})}>按钮</button>
}

function App() {


    return (
        <>
            <ConfigProvider>
                <Test/>
            </ConfigProvider>

        </>
    );
}

export default App;
