/* */ 
"format cjs";
YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Tweenable"
    ],
    "modules": [
        "Tweenable",
        "Tweenable.token"
    ],
    "allModules": [
        {
            "displayName": "Tweenable",
            "name": "Tweenable",
            "description": "Tweenable constructor."
        },
        {
            "displayName": "Tweenable.token",
            "name": "Tweenable.token",
            "description": "This module adds string interpolation support to Shifty.\n\nThe Token extension allows Shifty to tween numbers inside of strings.  Among\nother things, this allows you to animate CSS properties.  For example, you\ncan do this:\n\n    var tweenable = new Tweenable();\n    tweenable.tween({\n      from: { transform: 'translateX(45px)' },\n      to: { transform: 'translateX(90xp)' }\n    });\n\n`translateX(45)` will be tweened to `translateX(90)`.  To demonstrate:\n\n    var tweenable = new Tweenable();\n    tweenable.tween({\n      from: { transform: 'translateX(45px)' },\n      to: { transform: 'translateX(90px)' },\n      step: function (state) {\n        console.log(state.transform);\n      }\n    });\n\nThe above snippet will log something like this in the console:\n\n    translateX(60.3px)\n    ...\n    translateX(76.05px)\n    ...\n    translateX(90px)\n\nAnother use for this is animating colors:\n\n    var tweenable = new Tweenable();\n    tweenable.tween({\n      from: { color: 'rgb(0,255,0)' },\n      to: { color: 'rgb(255,0,255)' },\n      step: function (state) {\n        console.log(state.color);\n      }\n    });\n\nThe above snippet will log something like this:\n\n    rgb(84,170,84)\n    ...\n    rgb(170,84,170)\n    ...\n    rgb(255,0,255)\n\nThis extension also supports hexadecimal colors, in both long (`#ff00ff`)\nand short (`#f0f`) forms.  Be aware that hexadecimal input values will be\nconverted into the equivalent RGB output values.  This is done to optimize\nfor performance.\n\n    var tweenable = new Tweenable();\n    tweenable.tween({\n      from: { color: '#0f0' },\n      to: { color: '#f0f' },\n      step: function (state) {\n        console.log(state.color);\n      }\n    });\n\nThis snippet will generate the same output as the one before it because\nequivalent values were supplied (just in hexadecimal form rather than RGB):\n\n    rgb(84,170,84)\n    ...\n    rgb(170,84,170)\n    ...\n    rgb(255,0,255)\n\n## Easing support\n\nEasing works somewhat differently in the Token extension.  This is because\nsome CSS properties have multiple values in them, and you might need to\ntween each value along its own easing curve.  A basic example:\n\n    var tweenable = new Tweenable();\n    tweenable.tween({\n      from: { transform: 'translateX(0px) translateY(0px)' },\n      to: { transform:   'translateX(100px) translateY(100px)' },\n      easing: { transform: 'easeInQuad' },\n      step: function (state) {\n        console.log(state.transform);\n      }\n    });\n\nThe above snippet will create values like this:\n\n    translateX(11.56px) translateY(11.56px)\n    ...\n    translateX(46.24px) translateY(46.24px)\n    ...\n    translateX(100px) translateY(100px)\n\nIn this case, the values for `translateX` and `translateY` are always the\nsame for each step of the tween, because they have the same start and end\npoints and both use the same easing curve.  We can also tween `translateX`\nand `translateY` along independent curves:\n\n    var tweenable = new Tweenable();\n    tweenable.tween({\n      from: { transform: 'translateX(0px) translateY(0px)' },\n      to: { transform:   'translateX(100px) translateY(100px)' },\n      easing: { transform: 'easeInQuad bounce' },\n      step: function (state) {\n        console.log(state.transform);\n      }\n    });\n\nThe above snippet will create values like this:\n\n    translateX(10.89px) translateY(82.35px)\n    ...\n    translateX(44.89px) translateY(86.73px)\n    ...\n    translateX(100px) translateY(100px)\n\n`translateX` and `translateY` are not in sync anymore, because `easeInQuad`\nwas specified for `translateX` and `bounce` for `translateY`.  Mixing and\nmatching easing curves can make for some interesting motion in your\nanimations.\n\nThe order of the space-separated easing curves correspond the token values\nthey apply to.  If there are more token values than easing curves listed,\nthe last easing curve listed is used."
        }
    ]
} };
});