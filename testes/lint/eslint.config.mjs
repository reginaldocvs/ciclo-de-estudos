import globals from "globals";
export default [{files:["s1.js"],languageOptions:{ecmaVersion:2024,sourceType:"script",globals:{...globals.browser,firebase:"readonly"}},
rules:{"no-undef":"error","no-unused-vars":["warn",{vars:"all",args:"none",caughtErrors:"none"}],"no-redeclare":"error","no-dupe-keys":"error","no-unreachable":"warn","no-self-assign":"warn","no-dupe-else-if":"error","no-duplicate-case":"error"}}];
