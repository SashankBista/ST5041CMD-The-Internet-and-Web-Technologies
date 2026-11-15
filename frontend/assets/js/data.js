// Sample data for the front-end preview. The backend will replace this.
window.ROOTLINE_CHALLENGES = [
 {
  "id": 1,
  "name": "Cookie monster",
  "cat": "web",
  "diff": "easy",
  "pts": 150,
  "solves": 41,
  "solvedAt": "13:41",
  "blurb": "The site remembers who you are. Make it remember someone else.",
  "desc": "The site remembers you with a cookie. Find out how it decides who you are, then become someone else.",
  "target": "http://web1.ctf.rootline.local:8081",
  "files": [],
  "hints": [
   {
    "text": "Look at the cookies your browser stores after you log in.",
    "cost": 50,
    "open": false
   },
   {
    "text": "The value is not encrypted, only encoded.",
    "cost": 50,
    "open": false
   }
  ],
  "firstBlood": "r00tkit",
  "fbTime": "09:05"
 },
 {
  "id": 2,
  "name": "Login bypass",
  "cat": "web",
  "diff": "medium",
  "pts": 300,
  "solves": 24,
  "solvedAt": "13:20",
  "blurb": "The admin panel trusts whatever you type.",
  "desc": "The admin panel checks your username and password in a strange way. Get in without knowing the password.",
  "target": "http://web1.ctf.rootline.local:8082",
  "files": [],
  "hints": [
   {
    "text": "What happens if the password contains a quote?",
    "cost": 50,
    "open": false
   }
  ],
  "firstBlood": "stackoverflown",
  "fbTime": "09:06"
 },
 {
  "id": 3,
  "name": "Template trouble",
  "cat": "web",
  "diff": "hard",
  "pts": 450,
  "solves": 9,
  "solvedAt": null,
  "blurb": "The greeting page says more than it should.",
  "desc": "A greeting page builds a message from your name. See how far that goes.",
  "target": "http://web2.ctf.rootline.local:8083",
  "files": [],
  "hints": [
   {
    "text": "Try a name that is also an expression.",
    "cost": 75,
    "open": false
   },
   {
    "text": "Find out which template engine the app uses.",
    "cost": 75,
    "open": false
   }
  ],
  "firstBlood": "segfault",
  "fbTime": "09:07"
 },
 {
  "id": 14,
  "name": "Robots rule",
  "cat": "web",
  "diff": "easy",
  "pts": 100,
  "solves": 58,
  "solvedAt": "09:21",
  "blurb": "Some pages are hidden on purpose.",
  "desc": "The site has a page it does not want search engines to find. Find it.",
  "target": "http://web1.ctf.rootline.local:8084",
  "files": [],
  "hints": [
   {
    "text": "Every site can say which pages crawlers should skip.",
    "cost": 25,
    "open": false
   }
  ],
  "firstBlood": "packet_loss",
  "fbTime": "09:08"
 },
 {
  "id": 15,
  "name": "Hidden form",
  "cat": "web",
  "diff": "medium",
  "pts": 300,
  "solves": 20,
  "solvedAt": "09:58",
  "blurb": "Not every field is meant for you.",
  "desc": "A form has a field you cannot see. Change what it sends.",
  "target": "http://web2.ctf.rootline.local:8085",
  "files": [],
  "hints": [
   {
    "text": "Your browser's developer tools show the full page.",
    "cost": 50,
    "open": false
   }
  ],
  "firstBlood": "zero_day",
  "fbTime": "09:09"
 },
 {
  "id": 16,
  "name": "Header hunt",
  "cat": "web",
  "diff": "medium",
  "pts": 350,
  "solves": 17,
  "solvedAt": "10:22",
  "blurb": "The server talks to you in headers.",
  "desc": "Requests and responses carry more than the page. Find the flag in what the server says.",
  "target": "http://web1.ctf.rootline.local:8086",
  "files": [],
  "hints": [
   {
    "text": "Look at the response headers, not the body.",
    "cost": 50,
    "open": false
   }
  ],
  "firstBlood": "0xdeadbeef",
  "fbTime": "09:10"
 },
 {
  "id": 4,
  "name": "Caesar's second try",
  "cat": "crypto",
  "diff": "easy",
  "pts": 100,
  "solves": 52,
  "solvedAt": "12:58",
  "blurb": "Shift every letter. Then shift again.",
  "desc": "A message was scrambled by shifting its letters. The scrambler ran twice. Read the original.",
  "target": null,
  "files": [
   {
    "name": "message.txt",
    "size": "1 KB"
   }
  ],
  "hints": [
   {
    "text": "The shift is the same both times.",
    "cost": 25,
    "open": false
   }
  ],
  "firstBlood": "r00tkit",
  "fbTime": "09:11"
 },
 {
  "id": 5,
  "name": "Weak RSA",
  "cat": "crypto",
  "diff": "medium",
  "pts": 300,
  "solves": 9,
  "solvedAt": null,
  "blurb": "The key is shorter than it should be.",
  "desc": "A message was encrypted with RSA, but the key is small. Recover the message.",
  "target": null,
  "files": [
   {
    "name": "public.pem",
    "size": "1 KB"
   },
   {
    "name": "cipher.bin",
    "size": "2 KB"
   }
  ],
  "hints": [
   {
    "text": "Check the key size before you reach for a factoring tool.",
    "cost": 50,
    "open": false
   }
  ],
  "firstBlood": "zero_day",
  "fbTime": "10:41"
 },
 {
  "id": 6,
  "name": "XOR everything",
  "cat": "crypto",
  "diff": "medium",
  "pts": 200,
  "solves": 31,
  "solvedAt": "10:05",
  "blurb": "One key, used again and again.",
  "desc": "Every byte was combined with a short repeating key. Find the key and read the message.",
  "target": null,
  "files": [
   {
    "name": "secret.bin",
    "size": "3 KB"
   }
  ],
  "hints": [
   {
    "text": "Part of the plaintext is predictable.",
    "cost": 50,
    "open": false
   }
  ],
  "firstBlood": "segfault",
  "fbTime": "09:13"
 },
 {
  "id": 17,
  "name": "Base nonsense",
  "cat": "crypto",
  "diff": "easy",
  "pts": 150,
  "solves": 47,
  "solvedAt": "09:34",
  "blurb": "Encoding is not encryption.",
  "desc": "A string was encoded several times in a row. Unwrap it.",
  "target": null,
  "files": [
   {
    "name": "blob.txt",
    "size": "2 KB"
   }
  ],
  "hints": [
   {
    "text": "The characters give away the encoding.",
    "cost": 25,
    "open": false
   }
  ],
  "firstBlood": "packet_loss",
  "fbTime": "09:14"
 },
 {
  "id": 18,
  "name": "Padding pain",
  "cat": "crypto",
  "diff": "hard",
  "pts": 450,
  "solves": 11,
  "solvedAt": "11:48",
  "blurb": "The server tells you when the padding is wrong.",
  "desc": "A service decrypts whatever you send and says whether the padding was valid. That is more information than it should give.",
  "target": "nc crypto1.ctf.rootline.local 9100",
  "files": [
   {
    "name": "server.py",
    "size": "3 KB"
   }
  ],
  "hints": [
   {
    "text": "Each answer from the server leaks one bit.",
    "cost": 50,
    "open": true
   },
   {
    "text": "Work backwards one byte at a time.",
    "cost": 100,
    "open": false
   }
  ],
  "firstBlood": "zero_day",
  "fbTime": "09:15"
 },
 {
  "id": 7,
  "name": "Ghost in the pcap",
  "cat": "forensics",
  "diff": "medium",
  "pts": 250,
  "solves": 18,
  "solvedAt": null,
  "blurb": "Someone sent a secret over the wire.",
  "desc": "A network capture holds a conversation that was not meant to be read. Find what was sent.",
  "target": null,
  "files": [
   {
    "name": "capture.pcap",
    "size": "4 MB"
   }
  ],
  "hints": [
   {
    "text": "Follow the conversation, not single packets.",
    "cost": 50,
    "open": false
   }
  ],
  "firstBlood": "0xdeadbeef",
  "fbTime": "09:16"
 },
 {
  "id": 8,
  "name": "Hidden layers",
  "cat": "forensics",
  "diff": "easy",
  "pts": 200,
  "solves": 27,
  "solvedAt": "12:31",
  "blurb": "An image hides more than it shows.",
  "desc": "An ordinary picture holds a second file. Pull it out.",
  "target": null,
  "files": [
   {
    "name": "holiday.png",
    "size": "2 MB"
   }
  ],
  "hints": [
   {
    "text": "Check what is stored after the image data ends.",
    "cost": 25,
    "open": false
   }
  ],
  "firstBlood": "nullbyte",
  "fbTime": "12:31"
 },
 {
  "id": 19,
  "name": "Lost partition",
  "cat": "forensics",
  "diff": "medium",
  "pts": 350,
  "solves": 14,
  "solvedAt": "11:10",
  "blurb": "A disk image with a missing file.",
  "desc": "A disk image had a file deleted from it. Bring it back.",
  "target": null,
  "files": [
   {
    "name": "disk.img",
    "size": "12 MB"
   }
  ],
  "hints": [
   {
    "text": "Deleted does not mean gone.",
    "cost": 50,
    "open": false
   }
  ],
  "firstBlood": "stackoverflown",
  "fbTime": "09:18"
 },
 {
  "id": 20,
  "name": "Memory lane",
  "cat": "forensics",
  "diff": "hard",
  "pts": 500,
  "solves": 8,
  "solvedAt": "11:36",
  "blurb": "A memory dump from a running machine.",
  "desc": "A memory dump was taken from a machine while something odd was running. Find out what it was doing.",
  "target": null,
  "files": [
   {
    "name": "memory.dmp",
    "size": "64 MB"
   }
  ],
  "hints": [
   {
    "text": "List the running processes first.",
    "cost": 75,
    "open": false
   },
   {
    "text": "One process has no parent.",
    "cost": 75,
    "open": false
   }
  ],
  "firstBlood": "segfault",
  "fbTime": "09:19"
 },
 {
  "id": 9,
  "name": "Strings attached",
  "cat": "reverse",
  "diff": "easy",
  "pts": 250,
  "solves": 22,
  "solvedAt": "12:02",
  "blurb": "The answer is already in the file.",
  "desc": "A small program checks a password. You do not need to run it to learn the answer.",
  "target": null,
  "files": [
   {
    "name": "strings_attached",
    "size": "18 KB"
   }
  ],
  "hints": [
   {
    "text": "A program keeps its text inside itself.",
    "cost": 25,
    "open": false
   }
  ],
  "firstBlood": "packet_loss",
  "fbTime": "09:20"
 },
 {
  "id": 10,
  "name": "Crackme.exe",
  "cat": "reverse",
  "diff": "hard",
  "pts": 450,
  "solves": 5,
  "solvedAt": null,
  "blurb": "Find the check and get past it.",
  "desc": "A program asks for a serial number and tells you if it is right. Work out what it wants.",
  "target": null,
  "files": [
   {
    "name": "crackme.exe",
    "size": "40 KB"
   }
  ],
  "hints": [
   {
    "text": "Find where the program compares your input.",
    "cost": 75,
    "open": false
   }
  ],
  "firstBlood": "zero_day",
  "fbTime": "09:21"
 },
 {
  "id": 21,
  "name": "Packed lunch",
  "cat": "reverse",
  "diff": "medium",
  "pts": 350,
  "solves": 12,
  "solvedAt": "10:41",
  "blurb": "The program unpacks itself while running.",
  "desc": "The real program is hidden inside a packed one. Let it unpack, then read it.",
  "target": null,
  "files": [
   {
    "name": "packed",
    "size": "120 KB"
   }
  ],
  "hints": [
   {
    "text": "Let it unpack, then look at memory.",
    "cost": 50,
    "open": false
   }
  ],
  "firstBlood": "0xdeadbeef",
  "fbTime": "09:22"
 },
 {
  "id": 22,
  "name": "Spaghetti code",
  "cat": "reverse",
  "diff": "medium",
  "pts": 400,
  "solves": 10,
  "solvedAt": "11:02",
  "blurb": "Hard to read on purpose.",
  "desc": "The logic is all there but tangled on purpose. Untangle it and find the flag.",
  "target": null,
  "files": [
   {
    "name": "spaghetti",
    "size": "55 KB"
   }
  ],
  "hints": [
   {
    "text": "Rename things as you understand them.",
    "cost": 50,
    "open": false
   }
  ],
  "firstBlood": "r00tkit",
  "fbTime": "09:23"
 },
 {
  "id": 11,
  "name": "Stack smash 101",
  "cat": "pwn",
  "diff": "hard",
  "pts": 500,
  "solves": 3,
  "solvedAt": null,
  "blurb": "A tiny service with a big mistake.",
  "desc": "A small service reads more than it should. Take control of the program and read the flag.",
  "target": "nc pwn1.ctf.rootline.local 9001",
  "files": [
   {
    "name": "vuln",
    "size": "16 KB"
   },
   {
    "name": "vuln.c",
    "size": "1 KB"
   }
  ],
  "hints": [
   {
    "text": "How much does the program read into its buffer?",
    "cost": 75,
    "open": false
   },
   {
    "text": "Find the address of the win function.",
    "cost": 100,
    "open": false
   }
  ],
  "firstBlood": "stackoverflown",
  "fbTime": "09:24"
 },
 {
  "id": 23,
  "name": "Buffer basics",
  "cat": "pwn",
  "diff": "easy",
  "pts": 250,
  "solves": 36,
  "solvedAt": "09:12",
  "blurb": "Write more than the program expects.",
  "desc": "The program copies your input into a small space. Give it too much.",
  "target": "nc pwn1.ctf.rootline.local 9002",
  "files": [
   {
    "name": "basics",
    "size": "14 KB"
   }
  ],
  "hints": [
   {
    "text": "Count how many characters it takes to crash.",
    "cost": 25,
    "open": false
   }
  ],
  "firstBlood": "segfault",
  "fbTime": "09:25"
 },
 {
  "id": 24,
  "name": "Format fumble",
  "cat": "pwn",
  "diff": "medium",
  "pts": 400,
  "solves": 15,
  "solvedAt": "10:12",
  "blurb": "The program prints what you tell it to.",
  "desc": "The program uses your input as its own instructions for printing. Make it print what it should not.",
  "target": "nc pwn2.ctf.rootline.local 9003",
  "files": [
   {
    "name": "fumble",
    "size": "15 KB"
   }
  ],
  "hints": [
   {
    "text": "Format specifiers read from the stack.",
    "cost": 50,
    "open": false
   }
  ],
  "firstBlood": "packet_loss",
  "fbTime": "09:26"
 },
 {
  "id": 25,
  "name": "Ret2win",
  "cat": "pwn",
  "diff": "medium",
  "pts": 450,
  "solves": 12,
  "solvedAt": "10:49",
  "blurb": "Jump to the function you are not supposed to reach.",
  "desc": "A function that prints the flag exists but is never called. Make the program call it.",
  "target": "nc pwn2.ctf.rootline.local 9004",
  "files": [
   {
    "name": "ret2win",
    "size": "15 KB"
   }
  ],
  "hints": [
   {
    "text": "The return address sits right after the buffer.",
    "cost": 50,
    "open": false
   }
  ],
  "firstBlood": "zero_day",
  "fbTime": "09:27"
 },
 {
  "id": 26,
  "name": "Canary cage",
  "cat": "pwn",
  "diff": "hard",
  "pts": 550,
  "solves": 6,
  "solvedAt": "11:57",
  "blurb": "A guard value stands between you and the return.",
  "desc": "A guard value protects the return address. Find a way around it.",
  "target": "nc pwn1.ctf.rootline.local 9005",
  "files": [
   {
    "name": "canary",
    "size": "17 KB"
   }
  ],
  "hints": [
   {
    "text": "The guard can be read before it is checked.",
    "cost": 50,
    "open": true
   },
   {
    "text": "It never changes during one run.",
    "cost": 100,
    "open": false
   }
  ],
  "firstBlood": "0xdeadbeef",
  "fbTime": "09:28"
 }
];
