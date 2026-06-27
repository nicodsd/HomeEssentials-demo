const fs = require('fs');
const files = [
  'src/store/actions/curriculums.js',
  'src/store/actions/contactRead.js',
  'src/store/actions/categories.js',
  'src/store/actions/carrito_action.js',
  'src/store/actions/cardsHome.js'
];
files.forEach(f => {
  let p = 'c:/Users/Nicolas/REPOS git/HomeEssentials-demo/' + f;
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/import axios from ["']axios["'];?\r?\n/, '');
    
    // Replace let res = await axios(url)
    content = content.replace(/let res = await axios\((.*?)\)/g, 'let response = await fetch($1)\n        let res = await response.json()');
    
    // Handle res.data
    content = content.replace(/res\.data/g, 'res');
    
    fs.writeFileSync(p, content);
    console.log('Updated ' + f);
  } else {
    console.log('Not found: ' + p);
  }
});
