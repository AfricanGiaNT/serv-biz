# PipeWorks Project: Client Presentation Script

## For Discovery Calls, Demos, and Pitches

---

## 🎯 Presentation Structure

**Total Time:** 15-20 minutes

**Format:** Conversational, consultative (not salesy)

**Goal:** Help them understand the opportunity cost of their current approach

**Honesty Level:** High - This is a proven concept in development, not a deployed case study

**Structure:**
1. Their Problem (3 min) - Make them feel understood
2. The Solution (4 min) - Show how it works
3. Projected Results (3 min) - Honest about projections vs. proof
4. Live Demo (5 min) - Let them experience it
5. Next Steps (2 min) - Clear path forward

---

## 📋 Pre-Meeting Checklist

Before the call:
- [ ] Review their website (note issues you spot)
- [ ] Google their business + "near me" (see what customers see)
- [ ] Check if they have chat/contact form (note response time)
- [ ] Note their business hours (spot after-hours gap)
- [ ] Prepare custom ROI estimate based on their industry
- [ ] Have demo environment ready (localhost:3000 or deployed)
- [ ] Prepare to screen share

---

## 🎬 Opening (30 seconds)

**You:**

"Thanks for taking the time to chat! Before we dive in, I want to make sure this is actually a good fit for your business. Can I ask you a couple of quick questions first?"

**Why this works:**
- Shows respect for their time
- Positions you as consultant, not salesperson
- You're qualifying them (power dynamic shift)

**Questions to ask:**
1. "How do customers typically find you?" (Google, referrals, repeat?)
2. "Do you get calls or inquiries outside business hours?" (Weekends, evenings?)
3. "What happens to those calls right now?" (Voicemail, miss them, competitor gets them?)
4. "How quickly do you typically respond to website inquiries?" (Be genuinely curious)

**Listen for pain:**
- Frustration about missed calls
- Mention of competitors responding faster
- Staff overwhelmed by phone calls
- Spending money on ads but leads not converting
- Manual lead qualification taking too much time

---

## 💔 Part 1: Their Problem (3 minutes)

### Opening Statement

**You:**

"So here's what I'm hearing: You're getting calls outside business hours, but they're going to voicemail. And by the time you call back, the customer has already hired someone else. Does that sound about right?"

**Wait for confirmation.**

**You:**

"This is incredibly common in service businesses, and it's costing you more money than you probably realize. Let me show you what I mean…"

### The Lost Revenue Calculation (Do this live with them)

**You:**

"How many calls or website inquiries would you estimate you miss per week after-hours or on weekends? Ballpark number."

**Them:** "Maybe 5-10?"

**You:**

"Okay, let's be conservative and say 6 per week. That's about 25 per month. Now, what percentage of those are actually ready to book? In service businesses, industry data shows it's usually around 30-40%."

**Them:** "Yeah, probably."

**You:**

"So 25 calls × 35% = about 9 real jobs per month that you're not even getting a chance to quote on. What's your average job value?"

**Them:** "R2,500 to R4,000."

**You:**

"Let's use R3,000 to be conservative. That's 9 jobs × R3,000 = **R27,000 per month you're potentially leaving on the table.** Over a year, that's R324,000 in revenue that could be going to competitors just because they answered first."

**Pause. Let that sink in.**

**You:**

"And that's just the after-hours calls. We haven't even talked about slow response times during business hours, or the time your staff wastes on unqualified leads. Want to see how I'm solving this exact problem?"

---

## 💡 Part 2: The Solution (4 minutes)

### Introduce the Project Story (Be Honest)

**You:**

"I've built an AI-powered lead capture system specifically for service businesses like yours. I'm currently testing it with a plumbing business concept in Johannesburg to prove the model works. Let me show you what I've built…"

**Important:** Be transparent that this is a demonstration project, not a live case study with 90 days of data.

### Walk Through The System (Use screen share)

**Step 1: Customer Experience**

**You:**

"When someone visits the website, an AI chatbot appears immediately. Not a basic bot with scripted responses—this uses OpenAI's GPT-4o-mini, the same AI powering ChatGPT, but trained specifically for plumbing services."

**Show example conversation (live demo):**

```
Customer: "My geyser is leaking"
AI: "I can help! How bad is the leak? Is water actively dripping?"
Customer: "Yeah, maybe 1 liter per hour"
AI: "That needs attention soon. Where are you located in Johannesburg?"
Customer: "Sandton"
AI: "Perfect, we cover Sandton. Geyser repairs typically cost R800-R2,500.
What's your name and phone number so we can call you back?"
```

**You:**

"Notice how natural that conversation is? The AI understands context, knows the pricing ranges for different services, and qualifies the lead automatically. And this works **24/7**—at 3 AM on Christmas Day, the AI is still there."

**Technical note (if they ask):** "It uses streaming responses, so it feels instant—just like ChatGPT. Response time is under 200 milliseconds for the first word."

**Step 2: Business Owner Experience**

**You:**

"Now here's where it gets powerful. Within 3-5 seconds of capturing contact information, the business owner gets this notification on their phone:"

**Show Telegram notification (screen share your phone or desktop Telegram):**

```
🔔 NEW LEAD - STANDARD

👤 Thabo Nkosi
📞 +27 82 555 1234
📍 Sandton

🚨 Problem: Geyser leaking, ~1L/hour
⏰ Received: 2:34 PM

🤖 AI Notes:
Customer mentioned water dripping fast from geyser.
Located in Sandton service area.
Aware of typical pricing range.

[📞 Call Customer] [👁 View Full Chat] [✅ Mark Contacted]
```

**You:**

"You literally just click 'Call Customer' and your phone dials. From website visit to you calling back: **target is under 7 minutes**. Even if it's 11 PM on Saturday."

**Compare to old way:**

"Compare that to the traditional approach: customer submits form, you check email hours later, they've already moved on. Or worse—voicemail that sits until Monday morning."

### The Smart Part (Qualification)

**You:**

"But here's what makes this really valuable: **the AI automatically filters out unqualified leads**."

**Examples:**

1. "If someone types 'I'm in Pretoria' (outside service area), the AI politely declines. You never even see that lead."

2. "If someone's just price shopping with no urgency, the AI provides info but doesn't send you an alert."

3. "If someone types keywords like 'burst pipe' or 'flooding,' the system marks it as EMERGENCY and alerts you immediately."

**You:**

"You only get notifications for **qualified leads**: right location, realistic budget, clear need. The system tracks everything in a database for analytics."

**Technical credibility:**

"This runs on Next.js with a PostgreSQL database. It's not a no-code tool that breaks—it's production-grade code. I can show you the database schema if you're technically minded."

---

## 📈 Part 3: Projected Results (3 minutes)

### Lead with Honesty, Then Math

**You:**

"Now, I need to be completely transparent with you: this system is currently in development. I'm in week 5 of an 8-week build. So I don't have '90 days of live data' to show you yet."

**Pause.**

**You:**

"But what I can show you is the math—based on industry averages and what similar systems achieve. Here's what service businesses typically see:"

### Show Projected Impact

**Revenue Recovery (After-Hours):**

**You:**

"Based on your numbers—let's say 25 missed after-hours inquiries per month—if you capture those with AI and convert at 40%, that's 10 extra jobs."

"At R3,000 average: **R30,000-R35,000/month recovered revenue**."

"Conservative estimate because some leads will still be tire-kickers, but AI filters most of those out."

**Faster Response = Better Conversion:**

**You:**

"Industry data shows response time under 10 minutes converts at 50-55%, versus 30-35% when you respond in hours."

"If you're getting 20 leads per week now and converting 35%, that's 7 jobs. Bump that to 50% conversion: 10 jobs. That's 3 extra jobs per week."

"3 jobs × R3,000 × 4.3 weeks = **R38,700/month additional revenue** just from faster response."

**Time Savings:**

**You:**

"Your staff spends how many hours per week qualifying leads? Let's say 10 hours."

"AI handles 70-80% of that automatically. That's 7-8 hours back per week, or **30-35 hours per month**."

"At R120/hour staff cost: R3,600-R4,200/month saved. But more importantly, your staff can focus on customer service instead of asking the same questions repeatedly."

### Total Impact (Conservative)

**You:**

"So conservatively:
- After-hours recovery: R30,000/month
- Better conversion: R35,000/month
- Time savings value: R4,000/month

**Total: R69,000/month benefit**

But let's be realistic and say you only capture 60% of that: **R40,000-R45,000/month**."

### ROI Math

**You:**

"The system costs approximately R45,000-R50,000 to build, plus R500-R800/month to operate."

"At R40,000/month benefit, payback is roughly 1-2 months."

"After that, it's generating R38,000+/month in margin. Over a year: R450,000+."

**Important caveat:**

"Now, these are projections. Your actual results depend on your lead volume, conversion rates, and how quickly you respond to alerts. But this is based on real industry data, not made-up numbers."

---

## 🎥 Part 4: Live Demo (5 minutes)

### Set It Up

**You:**

"Rather than me just showing slides, want to actually interact with the system?"

**Share screen to demo site (localhost:3000 or deployed URL)**

**You:**

"This is the working system. I'll share the link so you can try it after our call, but let's walk through it together now."

### Guide Them Through

**You:**

"Pretend you're a customer with a plumbing emergency. Type something like 'My pipe burst, water everywhere' and see how it responds."

**Let them interact.**

**Point out features as they experience them:**

**1. Natural Conversation:**
"See how it doesn't feel like a bot? That's GPT-4o-mini understanding context."

**2. Qualification Questions:**
"Notice it's asking about location and severity naturally, not in a robotic checklist."

**3. Pricing Transparency:**
"It knows your pricing ranges and shares them upfront—builds trust."

**4. South African Context:**
"It uses 'geyser' not 'water heater,' understands Johannesburg suburbs, handles SA phone formats."

**5. Phone Extraction:**
"Watch what happens when you type a phone number in any format—082 555 1234, +27 82 555 1234, whatever. It normalizes it to +27825551234 automatically."

### Show the Backend

**You:**

"Now let me show you what happens on your end…"

**Switch to your phone or Telegram desktop:**

"Within 3-5 seconds, this notification appears with everything you need. Click 'Call Customer' and your phone dials. Click 'View Full Chat' and you see the entire conversation."

**Show the database (if appropriate):**

"Everything is tracked: lead status, urgency level, timestamps, AI cost per conversation. You can see analytics on response times, conversion rates, busiest hours, etc."

### Address the Obvious Question

**You:**

"I know what you're thinking: 'What if the AI gives wrong information or says something stupid?'"

**Honest answer:**

"It will occasionally. No AI is perfect."

**But here's how we handle it:**

1. **Training:** "The AI is trained specifically on YOUR services, YOUR pricing, YOUR service area before launch. We spend time configuring it."

2. **Escalation:** "For complex or unusual requests, the AI says 'Let me have someone call you to discuss that' rather than guessing."

3. **Monitoring:** "You can review all conversations. If you see errors, we adjust the training. It gets smarter over time."

4. **Human takeover:** "If a customer says 'I want to talk to a real person,' the AI shows a contact form immediately."

**Technical note:**

"In my testing so far, the AI handles about 85-90% of conversations correctly without issues. The other 10-15% are edge cases that get escalated anyway—so nothing is lost."

---

## 🚀 Part 5: Next Steps (2 minutes)

### Make It Easy

**You:**

"So here's how this would work if you wanted something similar for your business:"

### Option A: I'm Interested (Full Build)

**Timeline:** 6-8 weeks from kickoff to launch

**Investment:**
- One-time development: **R40,000-R50,000** (depends on complexity and customization)
- Monthly operational: **R500-R800** (hosting, AI API, database, monitoring)

**What you get:**
- Custom AI trained on YOUR services, pricing, service area, terminology
- YOUR branding on the website integration
- Notifications to YOUR phone (Telegram, or we can discuss SMS/WhatsApp)
- Complete database with lead tracking and analytics
- Setup, testing, and training included
- 30 days post-launch support for adjustments
- Source code ownership (you own it, not renting)

**Development process:**
1. Week 1-2: Requirements gathering, AI training, design
2. Week 3-4: Core build (chatbot, notifications, database)
3. Week 5-6: Your branding, content, testing
4. Week 7-8: Final refinements, deployment, training

**Next step:**

**You:**

"I'd create a custom proposal showing exactly what it would look like for your business, with a detailed ROI estimate based on YOUR numbers—not generic projections. Takes me about 3-5 days to put that together. Sound good?"

### Option B: I'm Curious But Not Ready

**You:**

"If you're interested but want to think about it, totally understand. What I can do is:"

1. **Send you detailed documentation** - Technical breakdown, architecture, features
2. **Give you demo access** - Play with it as much as you want, test different scenarios
3. **Share an ROI calculator** - Plug in your numbers, see realistic projections
4. **Follow up in 2-3 weeks** - Check if you have questions or want to move forward

"No pressure—this is a significant investment and you should feel confident about it."

### Option C: This Isn't For Me

**You:**

"And if after seeing this, you don't think it's a fit for your business right now, that's completely fine. I appreciate you taking the time to learn about it."

"Can I ask: what would make this more valuable for you? Is it the price point, the features, timing, or just not a priority?"

**Listen to their feedback.** This is gold for improving your offering.

---

## 🎯 Handling Common Objections

### "This seems expensive."

**You:**

"I totally get that R45,000 feels like a lot upfront. Let me reframe it:"

"Based on your numbers, you're potentially losing R30,000-R40,000 every month right now from missed opportunities. This system is designed to recover that."

"So the real question isn't 'Can I afford R45,000?' It's 'Can I afford to keep losing R30,000+ per month?'"

"If the system recovers even half of what we projected—R20,000/month—it pays for itself in 2-3 months. After that, it's generating R240,000/year in margin."

**Alternative payment:**

"If cash flow is tight, we can discuss a payment plan. Some clients do 50% upfront, 50% at launch. Or even monthly payments over 6 months."

---

### "Can't I just use a free chatbot like Tidio or Drift?"

**You:**

"Great question—and you absolutely should try them first if you want!"

**Honest comparison:**

**Generic Chatbot (Tidio, Drift, Intercom):**
- ✅ Cheap/free to start
- ❌ Scripted responses ("Click here for pricing")
- ❌ Can't understand natural language well
- ❌ Can't qualify leads intelligently
- ❌ No South African phone number handling
- ❌ You still check it manually
- 💰 Eventually costs R800-R1,500/month at scale

**Custom AI System:**
- 💰 R45,000 upfront
- ✅ Natural conversation (GPT-4o-mini)
- ✅ Understands industry terminology
- ✅ Automatically qualifies and filters leads
- ✅ Instant mobile alerts with context
- ✅ Handles SA phone formats perfectly
- ✅ Built for your exact business
- 💰 R500-R800/month operational

**You:**

"The generic tools are fine for 'What are your hours?' questions. But they can't replace your receptionist or qualify leads intelligently. This can."

"If you want to try Tidio for a month and see if it solves your problem, go for it. I'm confident you'll see the difference. I'm still here when you're ready."

---

### "What if the AI makes mistakes or says something wrong?"

**You:**

"It will occasionally. Let me be completely honest: no AI is perfect, and I won't pretend otherwise."

"But here's the reality check: humans make mistakes too. Your staff forgets to write down details, mishears phone numbers, or gives inconsistent pricing."

**The AI is consistently good:**
- Captures every detail perfectly (no typos)
- Never forgets to ask qualifying questions
- Gives consistent pricing information
- Works when tired, sick, or on holiday
- Gets better with training

**In my testing:**
- 85-90% of conversations handled perfectly
- 10-15% are edge cases that get escalated to you anyway
- Nothing gets lost or missed

**Plus:**
"I include 30 days post-launch support specifically to catch issues and refine the AI training. We iterate until it's working at 95%+ accuracy for your specific business."

---

### "I don't have time to learn a new system."

**You:**

"Good news: there's almost nothing to learn."

**Customer side:**
- They just chat on your website like they would text a friend
- No download, no app, no account needed

**Your side:**
- You get notifications on your phone (just like text messages)
- Click "Call" to dial the customer
- That's literally it

**Training time:**
- 15 minutes to show you the Telegram bot
- 10 minutes to show you the dashboard (optional)
- That's all

"Your staff doesn't touch the system. Your customers don't need instructions. It just works in the background."

---

### "What about data security and POPI Act compliance?"

**You:**

"Excellent question—and yes, this is fully POPI Act compliant."

**Technical details:**
- Database hosted on Supabase (ISO 27001 certified)
- Data encrypted at rest and in transit
- No data sold or shared with third parties
- Privacy policy included in the website
- Customers can request data deletion
- All required POPI disclosures in place

**You:**

"I built the privacy policy specifically for South African compliance. Everything from data retention to customer rights is covered."

"Plus, you own the database—it's not sitting on my servers or some third-party platform you don't control."

---

### "How do I know this will actually work for my business?"

**You:**

"Honest answer: you don't, until we try it."

**But here's what reduces the risk:**

1. **Industry validation:** "Service businesses with after-hours demand see the highest ROI. If you're losing calls to voicemail, this directly addresses that."

2. **Conservative projections:** "The numbers I showed you are conservative—30-40% of potential, not 100%. Even half of that makes it worthwhile."

3. **Testing phase:** "We launch with testing first. You can try it for 2-3 weeks, see real data, and decide if it's performing."

4. **Payment structure:** "We can structure payment with milestones. You don't pay the full amount until you've seen it working."

5. **Iteration:** "The 30-day post-launch support means we refine until it works well for your business. It's not 'build and disappear.'"

**You:**

"Look, I'm confident in the system because the underlying problem—missed calls, slow response—is very real and measurable. If you're losing R30,000/month now, capturing even 50% of that is a huge win."

---

## 🎁 Closing Strong

### If They're Interested

**You:**

"Awesome! Here's exactly what happens next:"

**Step 1: Custom Proposal (3-5 days)**

"I'll create a detailed proposal specifically for your business that includes:
- Exact features and functionality
- ROI projection using YOUR numbers (not generic)
- Timeline with milestones
- Pricing breakdown (development + operational)
- Sample mockups with your branding
- Payment options"

**Step 2: Review Call (20 minutes)**

"Let's schedule 20-30 minutes next [day of week] to review the proposal together and answer any questions. Does [time] work for you?"

**Step 3: Demo Access**

"In the meantime, I'll send you:
- Link to the working demo (try it yourself)
- Technical documentation (how it's built)
- ROI calculator (plug in your numbers)"

**Get commitment:**

"Sound like a plan? What's the best email to send the proposal to?"

---

### If They're Not Ready

**You:**

"No problem at all—I appreciate you taking the time to see what I'm building."

**Leave the door open:**

"I'll send you:
1. Documentation (full technical breakdown)
2. Demo link (play with it as much as you want)
3. ROI calculator (see projections with your numbers)
4. My case study when it's complete (in about 3 weeks)"

**Follow-up:**

"Is it okay if I check in with you in [2-3 weeks / 1 month] just to see if anything's changed or if you have questions? No pressure, just a friendly follow-up."

**Learn:**

"Quick question before we wrap: what would make this more attractive for you? Is it the price, timing, features, or something else I should know?"

---

## 📝 Post-Meeting Checklist

**Within 2 hours of the call:**
- [ ] Send thank-you email (be genuinely appreciative)
- [ ] Attach technical documentation
- [ ] Include demo link (make sure it's working!)
- [ ] Include ROI calculator (Excel or Google Sheets)
- [ ] If interested: Confirm follow-up meeting time
- [ ] Add detailed notes to your CRM
- [ ] Draft custom proposal outline (if they're interested)

**Email template:**

```
Subject: Great chatting with you - [Their Business Name] AI System

Hi [Name],

Thanks for taking the time to chat today! I really enjoyed learning about
[specific detail they mentioned] and how you're currently handling leads.

As promised, here are the resources:

📱 Live Demo: [URL]
   (Try saying "My geyser is leaking in Sandton" and see how it responds)

📊 ROI Calculator: [Spreadsheet Link]
   (Plug in your numbers to see projected impact)

📄 Technical Documentation: [Attached]
   (How it's built, what it does, security details)

[IF INTERESTED:]
I'll have your custom proposal ready by [date]. We're scheduled to review
it together on [day] at [time]. If that changes, just let me know.

[IF NOT READY:]
No pressure at all—give these a look and let me know if you have questions.
I'll check in with you around [date] just to see if anything's changed.

Thanks again,
[Your name]

P.S. If you want to see the full case study when it's complete (in about
3 weeks with real data), I'm happy to send it over.
```

---

## 💡 Pro Tips

### Do's ✅

**✅ Be genuinely curious**
- Ask questions because you want to understand, not to pitch

**✅ Use their actual numbers**
- Don't rely on generic projections—customize ROI for them

**✅ Show, don't just tell**
- Live demo is 10x more powerful than screenshots

**✅ Be honest about limitations**
- "This is in development" builds trust more than fake testimonials

**✅ Address objections confidently**
- Don't dodge concerns—face them head-on with data

**✅ Make next steps crystal clear**
- "Here's what happens next…" (eliminate ambiguity)

**✅ Follow up quickly**
- Send resources within 2 hours while it's fresh

### Don'ts ❌

**❌ Use technical jargon unnecessarily**
- "API endpoints," "webhooks," "serverless" mean nothing to them

**❌ Oversell or promise unrealistic results**
- "You'll triple your revenue!" → Instant distrust

**❌ Rush through the demo**
- Let them experience it at their pace

**❌ Pressure them to decide immediately**
- "This price is only good today" → Red flag

**❌ Dismiss their concerns**
- If they're worried about something, take it seriously

**❌ Compare yourself negatively**
- Don't trash competitors—focus on your unique value

**❌ Talk more than you listen**
- 60/40 rule: They talk 60%, you talk 40%

---

## 📊 Success Metrics & Iteration

### After 10 Discovery Calls Using This Script:

**Expected Results (realistic):**
- **Interested rate:** 40-60% (4-6 want a proposal)
- **Close rate:** 20-30% (2-3 become clients)
- **Average deal size:** R45,000-R50,000 one-time + R700/month recurring

**If your numbers are lower:**
1. **Record your calls** (with permission) and review
2. **Ask trusted friends** for honest feedback
3. **Note which objections come up most** and refine your responses
4. **Focus on industries** where ROI is most obvious (emergency services)
5. **Test different ROI projections** (maybe you're being too conservative or aggressive)

### Improve Over Time

**After each call, ask yourself:**
- What question surprised me?
- What objection did I struggle with?
- What made them light up or pull back?
- How can I explain [X] better next time?

**Keep a "wins & losses" log:**

| Date | Business | Outcome | Key Insight |
|------|----------|---------|-------------|
| Dec 5 | HVAC Co | Proposal sent | Loved the urgency detection |
| Dec 7 | Locksmith | Not interested | Price too high for them |
| Dec 10 | Plumber | Closed! | After-hours pain was severe |

---

## 🎓 Practice Recommendations

**Before your first real call:**

1. **Practice with friends** (5-10 times)
   - Record it, watch it back, cringe, improve

2. **Know the numbers cold**
   - ROI calculations without hesitation

3. **Test the demo thoroughly**
   - Make sure it works flawlessly

4. **Prepare for top 5 objections**
   - Write out responses, practice them

5. **Set up your environment**
   - Good lighting, quiet space, fast internet

**During early calls:**

- **Be transparent:** "This is one of my first pitches, so bear with me"
- **Ask for feedback:** "How did that sound? Was anything unclear?"
- **Learn fast:** Each call should be better than the last

**Remember:**

You're not selling snake oil. You've built something genuinely useful that solves a real problem. You're helping them see an opportunity they're currently missing.

**You're a consultant showing them their blind spot—not a salesperson pushing something they don't need.**

---

## 🚀 Final Pep Talk

**Before the call:**

- You've built something impressive (4+ weeks of solid work)
- You understand their problem deeply (you've researched it)
- You have a real solution (not just an idea)
- You're offering genuine value (R40,000+/month recovered revenue)
- You're being honest (no fake testimonials, transparent about status)

**During the call:**

- Breathe. You've got this.
- Listen more than you talk
- Be curious, not pushy
- If they say no, it's not personal—maybe it's bad timing
- Every call is practice for the next one

**After the call:**

- Win or lose, you learned something
- One "yes" pays for many "no's"
- Keep iterating, keep improving
- You only need a few clients to validate this

**You're doing something most people only talk about: building and shipping. That's already a massive win.**

Now go close some deals. 🚀

---

*Last Updated: December 2, 2025*

*Project Status: Week 5 - Core Features Complete, Testing in Progress*

*Remember: Honesty builds trust. Trust builds relationships. Relationships build businesses.*



