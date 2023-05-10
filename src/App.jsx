import { useState } from 'react'
import './App.css'

function App() {
    const [byteInputValue, setByteInputValue] = useState("");

    const opcodes = new Map([
        [0x00, "halt"],
        [0x10, "nop"],
        [0x20, "rrmov"],
        [0x30, "irmov"],
        [0x40, "rmmov"],
        [0x50, "mrmov"],
        [0x60, "add"],
        [0x61, "sub"],
        [0x62, "and"],
        [0x63, "xor"],
        [0x70, "jmp"],
        [0x71, "jle"],
        [0x72, "jl"],
        [0x73, "je"],
        [0x74, "jne"],
        [0x75, "jge"],
        [0x76, "jg"],
        [0x80, "call"],
        [0x90, "ret"],
        [0xa0, "push"],
        [0xb0, "pop"],
    ]);

    function handleValueChanged(v) {
        const nums = v.split(' ').map(Number);


        setByteInputValue(v);
    }

    return (
        <>
        <div>
            <h1>y86 disas</h1>
        </div>
        <div>
            <ByteInput onValueChanged={handleValueChanged} />
            <Disas value={byteInputValue} />
        </div>
        <div>
            <h3>you're welcome :)</h3>
        </div>
        </>
    );
}

function ByteInput({ onValueChanged }) {
    return (
        <textarea
            id="textbox"
            placeholder="Paste bytes here..."
            onChange={e => onValueChanged(e.target.value)}
            rows={20}
            cols={50}
        />
    );
}

function Disas({ value }) {
    return (
        <textarea
            id="textbox"
            placeholder="Disassembly will pop up here"
            readOnly
            rows={20}
            cols={50}
            value={value}
        />
    );
}

export default App
