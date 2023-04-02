// SPDX-License-Identifier: AGPL-3.0-or-later
/*
 * Copyright (C) 2023 YAAS Dons Hackathon Team
 */

import { exec } from 'child_process';

const USAGE: string = "Usage: tgpt [command]";
const DEFAULT_WORD_LIMIT: number = 150;
const LONG_WORD_LIMIT: number = 500;
const LINE_LIMIT = 80;

function get_key(): string
{
	const key: string | undefined = process.env["OPENAI_API_KEY"];
	if (key === undefined) {
		console.log("error: can not access key");
		process.exit(-1);
	}

	return key;
}

function box_text(inputString: string): string
{
	const words: string[] = inputString.split(" ");
	let curr_line: string = "";
	let boxed_str: string = "";

	for (let i = 0; i < words.length; i++) {
		const curr_word = words[i];

		if (curr_line.length + curr_word.length + 1 <= LINE_LIMIT) {
			curr_line += curr_word + " ";
		} else {
			boxed_str += `| ${curr_line.trim().padEnd(LINE_LIMIT)}|\n`;
			curr_line = `${curr_word} `;
		}
	}

	if (curr_line)
		boxed_str += `| ${curr_line.trim().padEnd(LINE_LIMIT)}|\n`;

	const top_line: string = "+".padEnd(LINE_LIMIT + 2, "-") + "+\n";
	const bot_line: string = "+".padEnd(LINE_LIMIT + 2, "-") + "+";

	return `${top_line}${boxed_str}${bot_line}`;
}

function gpt(cmd: string, sz: number): void
{
	const { Configuration, OpenAIApi } = require("openai");
	const config = new Configuration({
		apiKey: get_key(),
	});
	const openai = new OpenAIApi(config);

	const run_prompt = async () => {
		const prompt = `
		Write a brief description that describes manual's `+ cmd + ` command.
		Strictly limit yourself to only ` + String(sz) + ` words.
		Return response in the following parsable JSON format:
		{
			"Q": "question",
			"A": "answer"
		}
		`;

		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: prompt,
			max_tokens: 500,
			temperature: 1,
		});

		const parsable_JSON_response = response.data.choices[0].text;
		const parsed_response = JSON.parse(parsable_JSON_response);

		console.log(box_text(String(parsed_response.A)));
	};

	run_prompt();
}

function check_cmd(cmd: string, callback: (exit_status: number) => void): void
{
	/* discard input by redirecting to `/dev/null` */
	const bash_script: string = "man " + cmd + " >/dev/null 2>&1; echo $?";
	exec(bash_script, (err, stdout, stderr) => {
		if (err) {
			console.error(`exec error: ${err}`);
			return callback(1);
		}

		if (stdout.trim() === "0")
			callback(0);
		else
			callback(1);
	});
}

function main(): number
{
	let fflag: boolean = false;
	let lflag: boolean = false;
	let sz: number = DEFAULT_WORD_LIMIT;

	const argv: string[] = process.argv.slice(1);
	const argc: number = argv.length;
	if (argc < 2 || argc > 5) {
		console.log("error: invalid arguments");
		console.log(USAGE);
		process.exit(-1);
	}

	if (new Set(argv.slice(1)).size !== argv.slice(1).length) {
		console.log("error: duplicated flags");
		process.exit(-1);
	}

	if (argv.includes("-s") && argv.includes("-l")) {
		console.log("error: size mismatch");
		process.exit(-1);
	}

	for (let i = 2; i < argc; i++) {
		if (argv[i] == "-f") {
			fflag = true;
		} else if (argv[i] == "-l") {
			lflag = true;
			sz = LONG_WORD_LIMIT;
		} else if (argv[i] == "-s") {
			sz = Number(argv[i + 1]);
			if (isNaN(sz)) {
				console.log("error: illegal size value");
				process.exit(-1);
			}

			if (sz < 0) {
				console.log("error: size can't be less than 0");
				process.exit(-1);
			}

			i++;
		} else {
			console.log("tgpt: invalid option %s", argv[i]);
			process.exit(-1);
		}
	}

	const cmd: string = argv[1];
	if (!fflag) {
		check_cmd(cmd, (ret: number) => {
			if (ret) {
				console.log("error: no entry for %s", cmd);
				process.exit(-1);
			}
		});
	}

	gpt(cmd, sz);
	return 0;
}

main();
