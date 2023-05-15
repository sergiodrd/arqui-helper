import { useState } from 'react'
import './App.css'

function App() {
    const [disas, setDisas] = useState("");

    const opcodes = new Map([
        [0x00, ["halt", 1]],
        [0x10, ["nop", 1]],
        [0x20, ["rrmov", 2]],
        [0x21, ["cmovle", 2]],
        [0x22, ["cmovl", 2]],
        [0x23, ["cmove", 2]],
        [0x24, ["cmovne", 2]],
        [0x25, ["cmovge", 2]],
        [0x26, ["cmovg", 2]],
        [0x30, ["irmov", 4]],
        [0x40, ["rmmov", 4]],
        [0x50, ["mrmov", 4]],
        [0x60, ["add", 2]],
        [0x61, ["sub", 2]],
        [0x62, ["and", 2]],
        [0x63, ["xor", 2]],
        [0x70, ["jmp", 3]],
        [0x71, ["jle", 3]],
        [0x72, ["jl", 3]],
        [0x73, ["je", 3]],
        [0x74, ["jne", 3]],
        [0x75, ["jge", 3]],
        [0x76, ["jg", 3]],
        [0x80, ["call", 3]],
        [0x90, ["ret", 1]],
        [0xa0, ["push", 2]],
        [0xb0, ["pop", 2]],
    ]);

    const registers = [
        "rax",
        "rcx",
        "rdx",
        "rbx",
        "rsp",
        "rbp",
        "rsi",
        "rdi",
    ];

    function handleValueChanged(v) {
        console.log(v);
        const nums = v.replace(/(\r\n|\n|\r)/gm, " ").split(' ').filter(c => c != '\n').map(n => parseInt(n, 16)).filter(n => n !== NaN);
        console.log(nums.map(n => n.toString(16)));
        let instructions = "";

        let i = 0;
        while(i < nums.length) {
            const [mnemonic, size] = opcodes.get(nums[i]);
            console.log(i + ", " + mnemonic + ", " + size);
            switch(size) {
                case 1: {
                    instructions += mnemonic + "\n";
                    i++;
                    break;
                }
                case 2: {
                    instructions += mnemonic + " ";

                    if(i + 1 >= nums.length) return;

                    const rA = nums[i + 1] & 0xF;
                    const rB = nums[i + 1] >>> 4;

                    if(rA !== 0xf && rB !== 0xf)
                        instructions += registers[rA] + ", " + registers[rB] + "\n";
                    else if(rA === 0xf)
                        instructions += registers[rA] + "\n";
                    else if(rB === 0xf)
                        instructions += registers[rB] + "\n";

                    i += 2;
                    break;
                }
                case 3: {
                    instructions += mnemonic + " ";

                    if(i + 2 >= nums.length) return;

                    const B2 = nums[i + 2];
                    const B1 = nums[i + 1];

                    const num = (B2 << 8) | B1;

                    instructions += "0x" + num.toString(16) + "\n";
                    i += 3;
                    break;
                }
                case 4: {
                    instructions += mnemonic + " ";

                    if(i + 3 >= nums.length) return;

                    const rA = nums[i + 1] & 0xF;
                    const rB = nums[i + 1] >>> 4;

                    const B3 = nums[i + 3];
                    const B2 = nums[i + 2];

                    const num = (B3 << 8) | B2;
                    const numstr = "0x" + num.toString(16);

                    if(mnemonic === "rmmov") {
                        instructions += registers[rB] + "+" + numstr + ", " + registers[rA] + "\n";
                    }
                    else if(mnemonic === "mrmov") {
                        instructions += registers[rA] + ", " + registers[rB] + "+" + numstr + "\n";
                    }
                    else {
                        if(rA !== 0xf && rB !== 0xf)
                            instructions += registers[rA] + ", " + registers[rB] + ", ";
                        else if(rA !== 0xf)
                            instructions += registers[rA] + ", ";
                        else if(rB !== 0xf)
                            instructions += registers[rB] + ", ";
                        instructions += numstr + "\n";
                    }

                    i += 4;
                    break;
                }
            }
        }

        setDisas(instructions);
    }

    return (
        <>
        <div>
            <h1>y86 disas</h1>
            <p>(pssst... destination in the left, source in the right)</p>
        </div>
        <div>
            <ByteInput onValueChanged={handleValueChanged} />
            <Disas value={disas} />
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
