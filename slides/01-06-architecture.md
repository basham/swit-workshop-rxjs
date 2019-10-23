# Component architecture

```
Root <dice-root>
│
├─ Picker <dice-picker>
│  └─ Input <dice-input> (×6)
│     ├─ Add die button <button is="dice-button">
│     └─ Remove die button <button>
│
├─ Toolbar <dice-toolbar>
│  ├─ Total <div>
│  ├─ Roll <button>
│  └─ Remove all <button>
│
└─ Tray <dice-tray>
   └─ Die <dice-die> (×N)
      └─ Button <button is="dice-button">
```
