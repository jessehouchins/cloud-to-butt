var defaultIf = 'PaaS, SaaS, IaaS, computing, data, storage, cluster, distributed, server, hosting, provider, grid, enterprise, provision, apps, hardware, software'
var defaultRules = [
  { from: 'the cloud', to: 'my butt' },
  { from: 'cloud', to: 'butt' }
]

chrome.storage.sync.get('rules', function(data) {
  var rules = data.rules || defaultRules
  walk(document.body, rules)
})

function walk(node, rules) {
  
  var child, next;

  switch ( node.nodeType ) {
    case 1:  // Element
    case 9:  // Document
    case 11: // Document fragment
      child = node.firstChild
      while ( child ) {
        next = child.nextSibling
        walk(child, rules)
        child = next
      }
      break

    case 3: // Text node
      handleText(node, rules)
      break
  }
}

function findCase(str) {
  var code = str.charCodeAt(0)
  if (code < 65 || code > 90) return 'lc'
  var words = str.split(' ')
  code = words[words.length - 1].charCodeAt(0)
  return (words.length < 2 || code < 65 || code > 90) ? 'sc' : 'tc'
}

function handleText(textNode, rules) {
  var v = textNode.nodeValue
  var m, match, matchCase, rule, code

  for (var r = 0; r < rules.length; r++) {
    rule = rules[r]
    if (!rule) continue
    if (typeof rule.replace.from === 'string') rule.replace.from = new RegExp(rule.replace.from, 'gi')
    match = v.match(rule.replace.from)

    if (!match) continue
    for (m = 0; m < match.length; m++) {
      matchCase = findCase(match[m])
      v = v.replace(match[m], rule.replace.to[matchCase])
    }
  }

  textNode.nodeValue = v;
}