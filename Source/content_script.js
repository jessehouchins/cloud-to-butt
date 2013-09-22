var defaultIf = 'PaaS, SaaS, IaaS, computing, data, storage, cluster, distributed, server, hosting, provider, grid, enterprise, provision, apps, hardware, software'
var defaultRules = [
  { from: 'the cloud', to: 'my butt' },
  { from: 'cloud', to: 'butt' }
]

chrome.storage.sync.get('rules', function(data) {
  var rules = data.rules || defaultRules
  walk(document.body, parseRules(rules))
})

function walk(node, rules) {
  // I stole this function from here:
  // http://is.gd/mwZp7E
  
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
    match = v.match(rule.from)
    if (!match) continue
    for (m = 0; m < match.length; m++) {
      matchCase = findCase(match[m])
      v = v.replace(match[m], rule.to[matchCase])
    }
  }

  textNode.nodeValue = v;
}

// convert `from` ro regex and `to` to case hash -- eventualy should do this from options for performance
function parseRules(rules) {
  var r, rule, lc, sc, tc, words, word
  for (r = 0; r < rules.length; r++) {
    rule = rules[r]
    if (!rule.from || !rule.to) {
      rules[r] = false
      continue
    }

    lc = rule.to.toLowerCase()
    sc = lc.substring(0,1).toUpperCase() + lc.substring(1)
    tc = []
    words = lc.split(' ')
    while (words.length) {
      word = words.shift()
      tc.push(word.substring(0,1).toUpperCase() + word.substring(1))
    }

    rule.from = new RegExp(rule.from, 'gi')
    rule.to = {
      lc: lc,
      sc: sc,
      tc: tc.join(' ')
    }
  }
  return rules
}

