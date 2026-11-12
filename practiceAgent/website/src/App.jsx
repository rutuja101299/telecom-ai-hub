import { useEffect, useRef, useState } from 'react'
import './App.css'

const features = [
  {
    icon: '✦',
    title: 'Baked before sunrise',
    text: 'Our bakers start early so every loaf, pastry, and cake reaches you warm, fragrant, and full of care.',
  },
  {
    icon: '◌',
    title: 'Ingredients you can trust',
    text: 'Real butter, good flour, seasonal fruit, and no shortcuts. Just honest ingredients in every bite.',
  },
  {
    icon: '♡',
    title: 'Made for your moments',
    text: 'From a quiet morning coffee to a table full of friends, we make something special for every occasion.',
  },
]

const plans = [
  { name: 'Morning bun', price: '5', detail: 'Cinnamon, sugar, and sunshine', featured: false },
  { name: 'Sourdough loaf', price: '9', detail: 'Slow-fermented and crackly', featured: true },
  { name: 'Celebration cake', price: '42', detail: 'Made to order for your table', featured: false },
]

const cakeCatalog = [
  { name: 'Princess Chocolate Cake', flavor: 'chocolate', occasions: ['birthday'], audience: 'child', weight: '1.5 kg', min: 1200, max: 1500, detail: 'A playful celebration design with rich chocolate layers.' },
  { name: 'Rainbow Chocolate Cake', flavor: 'chocolate', occasions: ['birthday', 'baby shower'], audience: 'child', weight: '1.5 kg', min: 1300, max: 1500, detail: 'Colorful layers make it a cheerful pick for younger guests.' },
  { name: 'Chocolate Fantasy Cake', flavor: 'chocolate', occasions: ['birthday', 'anniversary'], audience: 'all', weight: '1 kg', min: 1000, max: 1400, detail: 'A classic chocolate cake finished with a generous chocolate topping.' },
  { name: 'Chocolate Truffle Cake', flavor: 'chocolate', occasions: ['birthday', 'anniversary'], audience: 'all', weight: '1 kg', min: 1000, max: 1600, detail: 'A rich, elegant choice for chocolate lovers of any age.' },
  { name: 'Strawberry Swirl Cake', flavor: 'strawberry', occasions: ['birthday', 'anniversary', 'baby shower'], audience: 'all', weight: '1 kg', min: 1100, max: 1700, detail: 'Soft vanilla sponge layered with strawberry cream and fresh berry notes.' },
  { name: 'Red Velvet Romance', flavor: 'red velvet', occasions: ['anniversary', 'wedding', 'birthday'], audience: 'adult', weight: '1.5 kg', min: 1600, max: 2400, detail: 'Velvety layers and cream cheese frosting suit a special occasion.' },
  { name: 'Vanilla Berry Celebration', flavor: 'vanilla', occasions: ['birthday', 'anniversary', 'baby shower'], audience: 'all', weight: '1.5 kg', min: 1300, max: 1900, detail: 'Light vanilla sponge with a bright berry finish.' },
  { name: 'Butterscotch Crunch', flavor: 'butterscotch', occasions: ['birthday', 'anniversary'], audience: 'all', weight: '1 kg', min: 1000, max: 1600, detail: 'Caramel notes and a gentle crunch make this an easy crowd-pleaser.' },
  { name: 'Mango Garden Cake', flavor: 'mango', occasions: ['birthday', 'baby shower'], audience: 'all', weight: '1.5 kg', min: 1400, max: 2000, detail: 'A fruity, lighter-tasting option for a joyful gathering.' },
  { name: 'Pastel Baby Shower Cake', flavor: 'vanilla', occasions: ['baby shower'], audience: 'all', weight: '1.5 kg', min: 1800, max: 2800, detail: 'Soft pastel decoration and a gentle vanilla flavor for welcoming a little one.' },
  { name: 'Floral Wedding Cake', flavor: 'vanilla', occasions: ['wedding'], audience: 'adult', weight: '2 kg', min: 3500, max: 6000, detail: 'An elegant floral finish for a memorable reception centerpiece.' },
]

const emptyCakePreferences = { occasion: '', flavor: '', budget: null, ageGroup: '' }

const cakeOptionGroups = {
  occasion: {
    label: 'Choose an occasion',
    options: ['Birthday', 'Anniversary', 'Wedding', 'Baby shower', 'Graduation', 'Other celebration'],
  },
  flavor: {
    label: 'Choose a flavor',
    options: ['Chocolate', 'Vanilla', 'Red velvet', 'Butterscotch', 'Mango', 'Strawberry', 'Coffee'],
  },
  budget: {
    label: 'Choose a budget',
    options: ['Up to ₹1,000', '₹1,000–₹1,500', '₹1,500–₹2,500', '₹2,500–₹5,000', 'Above ₹5,000'],
  },
  ageGroup: {
    label: 'Who are we celebrating?',
    options: ['Child (under 13)', 'Teen (13–17)', 'Adult (18+)', 'Any age'],
  },
}

function parseCakePreferences(message, currentPreferences) {
  const text = message.toLowerCase()
  const preferences = { ...currentPreferences }

  const occasion = [
    ['baby shower', /baby\s*shower/],
    ['anniversary', /anniversar(?:y|ies)/],
    ['wedding', /wedding|marriage/],
    ['birthday', /birthday|b['’]?day/],
    ['graduation', /graduation|graduate/],
    ['other celebration', /celebrat|party|event/],
  ].find(([, pattern]) => pattern.test(text))
  if (occasion) preferences.occasion = occasion[0]

  const flavor = ['red velvet', 'butterscotch', 'chocolate', 'vanilla', 'strawberry', 'mango', 'fruit', 'coffee'].find((value) => text.includes(value))
  if (flavor) preferences.flavor = flavor

  const budgetMatch = text.match(/(?:₹|rs\.?|inr)\s*([\d,]+)|budget(?:\s*(?:is|of|around|under|:)?\s*₹?)\s*([\d,]+)|(?:under|below|within)\s*₹?\s*([\d,]+)|₹?\s*([\d,]+)\s*(?:budget|rupees|rs\b)/i)
  const budgetValue = budgetMatch && budgetMatch.slice(1).find(Boolean)
  if (budgetValue) {
    preferences.budget = Number(budgetValue.replaceAll(',', ''))
  } else if (!preferences.budget && /\bbudget\b/i.test(text)) {
    const number = text.match(/\b([\d,]{3,})\b/)
    if (number) preferences.budget = Number(number[1].replaceAll(',', ''))
  } else if (!preferences.budget && /^\s*[\d,]+\s*$/.test(text)) {
    const number = Number(text.replaceAll(',', '').trim())
    if (number >= 100) preferences.budget = number
    else if (preferences.occasion === 'birthday' && !preferences.ageGroup) preferences.ageGroup = `${number}-year-old`
  }

  const ageMatch = text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s*(?:birthday|years?\s*old|yrs?\s*old)\b|\b(\d{1,2})[- ]year[- ]old\b|\b(?:age|turning)\s*(\d{1,2})\b/)
  if (ageMatch) {
    preferences.ageGroup = `${ageMatch[1] || ageMatch[2] || ageMatch[3]}-year-old`
  } else if (/\b(infant|baby|toddler|child|kid|children)\b/.test(text)) {
    preferences.ageGroup = 'child'
  } else if (/\b(teen|teenager|adult|grown[- ]?up)\b/.test(text)) {
    preferences.ageGroup = text.match(/\b(teen|teenager|adult|grown[- ]?up)\b/)[0]
  } else if (/not applicable|no age|any age|all ages/i.test(text)) {
    preferences.ageGroup = 'any age'
  }

  return preferences
}

function getMissingCakeDetails(preferences) {
  const missing = []
  if (!preferences.occasion) missing.push('the occasion')
  if (!preferences.flavor) missing.push('your preferred flavor')
  if (!preferences.budget) missing.push('your budget in ₹')
  if (preferences.occasion === 'birthday' && !preferences.ageGroup) missing.push('the birthday person’s age or age group')
  return missing
}

function getCakeRecommendations(preferences) {
  const budget = preferences.budget
  const candidates = cakeCatalog
    .map((cake) => {
      let score = 0
      if (cake.flavor === preferences.flavor) score += 10
      if (cake.occasions.includes(preferences.occasion)) score += 5
      if (preferences.ageGroup && preferences.ageGroup !== 'any age') {
        if ((/child|kid|toddler|baby|\d{1,2}-year-old/.test(preferences.ageGroup) && cake.audience === 'child')) score += 3
        if ((/adult|grown|teen/.test(preferences.ageGroup) && cake.audience === 'adult')) score += 2
      }
      if (cake.max <= budget) score += 4
      else if (cake.min <= budget) score += 2
      else score -= 5
      return { ...cake, score, withinBudget: cake.min <= budget }
    })
    .sort((a, b) => b.score - a.score || a.min - b.min)

  const withinBudget = candidates.filter((cake) => cake.withinBudget)
  return (withinBudget.length >= 3 ? withinBudget : candidates).slice(0, 3)
}

function getCakeAssistantReply(message, currentPreferences) {
  const preferences = parseCakePreferences(message, currentPreferences)
  const missing = getMissingCakeDetails(preferences)

  if (missing.length) {
    const nextDetail = missing[0]
    const followUp = nextDetail === 'the occasion'
      ? 'What are we celebrating?'
      : nextDetail === 'your preferred flavor'
        ? 'Which flavor would you enjoy?'
        : nextDetail === 'your budget in ₹'
          ? 'What budget would you like to stay within?'
          : 'Who is the birthday cake for? Choose an age group or type their age.'
    return {
      preferences,
      reply: `${followUp}${missing.length > 1 ? ` I’ll ask for the other details next: ${missing.slice(1).join(', ')}.` : ''}`,
      recommendations: false,
    }
  }

  const recommendations = getCakeRecommendations(preferences)
  const recommendationText = recommendations.map((cake, index) => {
    const reasons = [cake.detail]
    if (!cake.withinBudget) reasons.push('This option is above your stated budget; ask us about a smaller size or simpler finish.')
    return `${index + 1}. ${cake.name}\n   ${reasons.join(' ')}\n   Suggested weight: ${cake.weight}\n   Estimated price: ₹${cake.min.toLocaleString('en-IN')}–₹${cake.max.toLocaleString('en-IN')}`
  }).join('\n\n')

  return {
    preferences: emptyCakePreferences,
    recommendations: true,
    reply: `🎂 Here are my top 3 cake picks for your ${preferences.occasion}, featuring ${preferences.flavor} and a budget of ₹${budgetLabel(preferences.budget)}:\n\n${recommendationText}\n\nPrices and designs are estimates. Contact hello@sweetcheery.example to confirm availability and place your order.`,
  }
}

function budgetLabel(value) {
  return value.toLocaleString('en-IN')
}

function ArrowIcon() {
  return <span className="arrow-icon" aria-hidden="true">↗</span>
}

function CupcakeLogo() {
  return (
    <span className="cupcake-logo" aria-hidden="true">
      <span className="cherry">
        <span className="cherry-fruit" />
        <span className="cherry-stem" />
      </span>
      <span className="cupcake-frosting">
        <span className="frosting-dot frosting-dot-left" />
        <span className="frosting-dot frosting-dot-right" />
        <span className="face">
          <span className="eye" />
          <span className="eye" />
          <span className="smile" />
        </span>
      </span>
      <span className="cupcake-wrapper" />
    </span>
  )
}

function BakeryChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [cakePreferences, setCakePreferences] = useState(emptyCakePreferences)
  const [showOptions, setShowOptions] = useState(true)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi there! I’m SweetCheery’s cake guide. Tell me the occasion, your favorite flavor, and your budget in ₹. For a birthday cake, please include the birthday person’s age or age group too.',
    },
  ])
  const messageListRef = useRef(null)

  useEffect(() => {
    if (isOpen && messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [isOpen, messages])

  const sendMessage = (question) => {
    const text = question.trim()
    if (!text) return

    const result = getCakeAssistantReply(text, cakePreferences)
    setCakePreferences(result.preferences)
    setShowOptions(!result.recommendations)
    setMessages((currentMessages) => [
      ...currentMessages,
      { role: 'user', text },
      { role: 'assistant', text: result.reply },
    ])
    setDraft('')
  }

  return (
    <div className="chat-widget">
      {isOpen && (
        <section className="chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-title">
          <header className="chat-header">
            <CupcakeLogo />
            <div className="chat-heading">
              <h2 id="chat-title">SweetCheery cake guide</h2>
              <p>Let’s find your celebration cake</p>
            </div>
            <button
              className="chat-close"
              type="button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </header>
          <div className="chat-messages" ref={messageListRef} aria-live="polite">
            {messages.map((message, index) => (
              <p className={`chat-message chat-message-${message.role}`} key={`${message.role}-${index}`}>
                {message.text}
              </p>
            ))}
            {showOptions && (() => {
              const firstMissing = getMissingCakeDetails(cakePreferences)[0]
              const optionKey = firstMissing === 'the occasion'
                ? 'occasion'
                : firstMissing === 'your preferred flavor'
                  ? 'flavor'
                  : firstMissing === 'your budget in ₹'
                    ? 'budget'
                    : firstMissing
                      ? 'ageGroup'
                      : null
              const optionGroup = optionKey ? cakeOptionGroups[optionKey] : null

              return optionGroup ? (
                <div className="chat-suggestions" aria-label={optionGroup.label}>
                  <span className="chat-options-label">{optionGroup.label}</span>
                  {optionGroup.options.map((option) => (
                    <button type="button" key={option} onClick={() => sendMessage(option)}>
                      {option}
                    </button>
                  ))}
                </div>
              ) : null
            })()}
          </div>
          <form
            className="chat-form"
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage(draft)
            }}
          >
            <label className="visually-hidden" htmlFor="chat-input">Tell SweetCheery about your cake preferences</label>
            <input
              id="chat-input"
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Occasion, flavor, budget..."
              autoComplete="off"
            />
            <button type="submit" aria-label="Send message" disabled={!draft.trim()}>
              <span aria-hidden="true">↑</span>
            </button>
          </form>
        </section>
      )}
      <button
        className={`chat-launcher ${isOpen ? 'is-open' : ''}`}
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close SweetCheery chat' : 'Open SweetCheery chat'}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <span aria-hidden="true">×</span> : <><CupcakeLogo /><span>Chat with us</span></>}
      </button>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <main className="site-shell">
      <nav className="navbar" aria-label="Main navigation">
        <a className="brand" href="#top" onClick={closeMenu}>
          <CupcakeLogo />
          <span>SweetCheery</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <div id="nav-links" className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
          <a href="#why" onClick={closeMenu}>Our bakery</a>
          <a href="#plans" onClick={closeMenu}>Menu</a>
          <a href="#stories" onClick={closeMenu}>Our story</a>
          <a className="nav-login" href="#get-started" onClick={closeMenu}>Visit us</a>
          <a className="nav-cta" href="#get-started" onClick={closeMenu}>Order something lovely <ArrowIcon /></a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> Small batch, big heart</p>
          <h1>Good things<br /><em>take time.</em></h1>
          <p className="hero-description">
            Slow mornings, golden pastries, and bread worth coming home for.
            SweetCheery is your neighborhood bakery, made fresh every day.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#plans">Explore today’s menu <ArrowIcon /></a>
            <a className="text-link" href="#why">Meet the bakery <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>J</span><span>M</span><span>A</span><span>+</span>
            </div>
            <span>Loved by neighbors near and far</span>
          </div>
        </div>
        <div className="hero-art" aria-label="Illustration of freshly baked bread and pastries in the SweetCheery bakery" role="img">
          <div className="bakery-shelf" />
          <div className="bakery-plate" />
          <div className="bakery-bread"><span /></div>
          <div className="bakery-pastry pastry-left"><span /></div>
          <div className="bakery-pastry pastry-right"><span /></div>
          <div className="bakery-sparkle sparkle-one">✦</div>
          <div className="bakery-sparkle sparkle-two">✦</div>
          <div className="art-label"><span>01</span><span>Fresh from our oven</span></div>
        </div>
      </section>

      <section className="marquee" aria-label="SweetCheery bakery values">
        <span>Baked with patience</span><b>✦</b><span>Seasonal flavors</span><b>✦</b><span>Warm welcomes</span><b>✦</b><span>Made to share</span>
      </section>

      <section className="section why-section" id="why">
        <div className="section-heading">
          <p className="eyebrow"><span className="eyebrow-line" /> Why SweetCheery</p>
          <h2>There is magic in<br /><em>the making.</em></h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <a href="#plans" aria-label={`Learn more about ${feature.title}`}>Learn more <span aria-hidden="true">→</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="section plans-section" id="plans">
        <div className="plans-intro">
          <p className="eyebrow"><span className="eyebrow-line" /> From our menu</p>
          <h2>Pick your<br /><em>favorite ritual.</em></h2>
          <p>There is always something warm on the counter. Stop in for one, or bring enough home to share.</p>
          <a className="text-link" href="#get-started">See the full menu <span aria-hidden="true">→</span></a>
        </div>
        <div className="plan-list">
          {plans.map((plan, index) => (
            <article className={`plan-card ${plan.featured ? 'is-featured' : ''}`} key={plan.name}>
              <div className="plan-number">0{index + 1}</div>
              <div>
                <h3>{plan.name}</h3>
                <p>{plan.detail}</p>
              </div>
              <div className="plan-price"><sup>$</sup>{plan.price}</div>
              <a href="#get-started" aria-label={`Order ${plan.name}`}><ArrowIcon /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-section" id="stories">
        <div className="quote-mark" aria-hidden="true">“</div>
        <blockquote>SweetCheery is the kind of place where you come in for a loaf and leave with a full heart — and probably a pastry too.</blockquote>
        <p>— Maya Chen, neighborhood regular</p>
      </section>

      <section className="cta-section" id="get-started">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" /> Come hungry, leave happy</p>
          <h2>Make today<br /><em>a little sweeter.</em></h2>
        </div>
        <a className="button button-light" href="mailto:hello@sweetcheery.example">Place an order <ArrowIcon /></a>
      </section>

      <footer className="footer">
        <a className="brand" href="#top"><CupcakeLogo /><span>SweetCheery</span></a>
        <p>Small batch, big heart.</p>
        <div className="footer-links"><a href="#why">About</a><a href="#plans">Menu</a><a href="mailto:hello@sweetcheery.example">Contact</a></div>
        <span className="copyright">© 2026 SweetCheery</span>
      </footer>
      <BakeryChatbot />
    </main>
  )
}

export default App
