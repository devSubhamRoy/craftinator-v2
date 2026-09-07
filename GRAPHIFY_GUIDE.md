# Graphify Cheat Sheet & Guide (Antigravity IDE)

Yeh file Graphify commands, unke use cases, aur update run karne par kya problems/benefits ho sakte hain, unka complete guide hai.

---

## 1. Important Commands & Use Cases

| Command | Kab Run Karein? | Use Case & Kaam |
| :--- | :--- | :--- |
| **`graphify update .`** | **Daily / Code edit ke baad** | Jab bhi aapne kisi file mein code change kiya ho ya naya component banaya ho. Yeh sirf modified files ko scan karke graph update karta hai. (AST-only, instant & free). |
| **`graphify . --code-only`** | **Fresh Indexing ke waqt** | Jab aapne bohot saari files/folders delete ya rename kiye hon aur aapko ek fresh, clean graph banana ho bina kisi LLM API key ke. |
| **`graphify export html`** | **Visual network dekhne ke liye** | `graphify-out/graph.html` ko regenerate karta hai jisse latest connections web graph mein dikhein. |
| **`graphify tree`** | **Hierarchy tree dekhne ke liye** | `graphify-out/GRAPH_TREE.html` regenerate karta hai D3 collapsible tree view ke liye. |
| **`Start-Process "graphify-out\graph.html"`** | **Browser mein kholne ke liye** | Interactive 3D/node visualizer ko browser mein open karta hai. |
| **`Start-Process "graphify-out\GRAPH_TREE.html"`** | **Browser mein kholne ke liye** | Collapsible folder-structure tree ko browser mein open karta hai. |
| **`graphify query "aapka question"`** | **Terminal mein query** | Antigravity terminal se seedhe puchne ke liye (jaise: `graphify query "where is CartDrawer used?"`). |
| **`graphify path "CompA" "CompB"`** | **Path trace karne ke liye** | Do components ke beech direct dependency dekhne ke liye (jaise: `graphify path "Header" "AuthModal"`). |

---

## 2. Nayi Files/Folders Add Karne Ya Update Command Chalane Par:

### Kya Koi Problem (Khatra) Ho Sakta Hai?
**Nahi! Aapka main code 100% safe rehta hai.**
* **Code Safe Hai:** Graphify **read-only** tool hai. Yeh aapke `src/`, `package.json`, ya kisi bhi code file ko touch ya delete nahi karta. Yeh sirf `graphify-out/` folder mein data likhta hai.
* **Syntax Errors:** Agar kisi nayi file mein incomplete code ya JavaScript syntax error hai, toh graphify uss file ko skip kar dega ya warning dega, par code kharab nahi karega.
* **Deleted/Renamed Files:** Agar aapne koi folder rename ya delete kiya aur sirf `graphify update .` chalaya, toh purane nodes cache mein reh sakte hain. Aise case mein solution simple hai: `graphify . --code-only` chala dein.
* **Non-Code Files (.css, images):** Graphify AST parser code (.jsx, .js, .json) ko samajhta hai. CSS aur images ko yeh skip kar deta hai (jab tak LLM API key na ho).

---

## 3. Iska Main Use Case Kya Hai?

1. **Antigravity AI Agent Ke Liye Ek "GPS Navigation":**
   Bina graph ke, AI ko har query ke liye ripgrep ya saari files bar-bar scan karni padti hain (tokens waste hote hain aur AI context bhool sakta hai). Graphify ke sath, AI direct exact file aur dependencies ko target karta hai.
2. **Instant Dependency Tracking:**
   Kisi component ko modify karne se pehle pata chal jata hai ki iska asar project mein aur kahan-kahan padega.
3. **Visual Architecture Understanding:**
   Naye developers ya complex projects mein `graph.html` aur `GRAPH_TREE.html` se poore project ka architecture visually samajh aa jata hai.
