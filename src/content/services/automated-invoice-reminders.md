---
title: Automated Invoice Reminders for UK Firms | Works AI
description: Get paid on time without awkward chasing. Automatic reminders by email and WhatsApp from Xero or QuickBooks, from [[price:workflowAutomation.build]], paid once. Book a free AI audit.
h1: Get paid on time without chasing a single invoice
answer: We connect your accounting software, such as Xero or QuickBooks, to a polite, automatic reminder schedule by email and WhatsApp, so late invoices get chased every time and you never have to.
path: /business/automated-invoice-reminders/
group: business
navLabel: Automated Invoicing & Payment Reminders
navBlurb: Automatic reminders for late invoices by email and WhatsApp.
keyword: automated invoice reminders
serviceType: Automated invoice and payment reminders
order: 32
updated: 2026-11-24
priceKey: workflowAutomation
course: automate-invoice-chasing-xero-n8n
problemPage: /get-found-on-google/
related:
  - /business/online-booking-system/
  - /services/ai-agents/
  - /services/ai-agents/whatsapp/
whatsappMessage: Hello Works AI, I'd like to automate my invoice reminders.
problem:
  - Late payment is one of the most common cash-flow problems for small UK businesses. The work is done, the invoice is sent, and then nothing. Chasing feels awkward, so it gets put off, and an invoice that is 7 days late becomes 60 days late.
  - Your accounting software can send a basic reminder, but often it is one generic email that is easy to ignore. Nobody follows up by phone or WhatsApp, and nobody notices which customers always pay late.
problemQuotes:
  - I hate chasing money from people I've just done a good job for.
  - I only notice an invoice is late when I check the bank at the end of the month.
deliverables:
  - title: A reminder schedule that works
    text: A friendly note before the due date, a reminder on the day, then firmer follow-ups at set intervals, each one written in your tone.
  - title: Email and WhatsApp
    text: Reminders go by email and, where the customer has agreed, by WhatsApp, which people tend to read sooner.
  - title: Connected to your accounts
    text: Works with Xero, QuickBooks, FreeAgent or Sage. When an invoice is paid, the reminders stop automatically.
  - title: Easy payment links
    text: Each reminder includes the invoice and a pay-now link, so paying takes seconds.
  - title: A weekly summary
    text: A short message each Monday showing what is overdue, who has been reminded and who needs a personal call from you.
scenario:
  kind: feed
  title: "One late invoice, chased automatically"
  business: "Example Design Studio"
  context: "A design studio sends around 30 invoices a month on 14-day terms. This is what happens to one of them."
  lines:
    - from: you
      text: "Invoice 1043 sent from Xero on 14-day terms"
      meta: "Day 0"
    - from: ai
      text: "Friendly heads-up with the invoice attached"
      meta: "Day 11"
    - from: ai
      text: "Due-date reminder with a pay-now link"
      meta: "Day 14"
    - from: ai
      text: "Polite follow-up by email and WhatsApp"
      meta: "Day 21"
    - from: customer
      text: "Customer pays through the link"
      meta: "Day 22"
    - from: ai
      text: "Xero marks it paid · all reminders stop"
      meta: "Day 22"
    - from: you
      text: "Monday summary: 0 invoices need a personal call"
      meta: "Day 26"
  outcome:
    title: "The owner only steps in"
    items:
      - "For the few invoices that reach the final stage"
      - "Never to send the same reminder twice"
      - "With a clear weekly list of what is overdue"
workflow:
  - actor: you
    title: "You send an invoice as usual"
    text: "You keep invoicing in Xero, QuickBooks, FreeAgent or Sage. Nothing changes in how you work."
  - actor: ai
    title: "The automation watches due dates"
    text: "Every day it checks which invoices are coming due or overdue."
  - actor: ai
    title: "A friendly reminder goes out"
    text: "Before and on the due date: a short note in your tone, with the invoice and a pay-now link."
    preview: "Hi Sam, a quick reminder that invoice 1043 is due on Friday. You can pay here: [link]"
  - actor: ai
    title: "Firmer follow-ups if it's late"
    text: "At the intervals you choose, by email and WhatsApp, referring to your payment terms."
  - actor: customer
    title: "Paid? The reminders stop"
    text: "As soon as the invoice is marked paid in your accounts, every reminder stops automatically."
  - actor: you
    title: "You only handle the exceptions"
    text: "A Monday summary shows what is overdue and who needs a personal call."
    preview: "3 invoices overdue \u00b7 \u00a32,140 \u00b7 1 needs a call (21 days)."
steps:
  - title: Audit
    text: A free 30-minute call to look at how you invoice, your payment terms, your accounting tool and the customers who pay late. You get a plan and a fixed price.
  - title: Build
    text: We connect your accounting software, set up the reminder schedule and messages with you, and test it on sample invoices before switching it on.
  - title: Launch and hand over
    text: We switch it on in accounts in your name, set up error alerts and show you how to change timings and wording yourself.
faq:
  - q: Which accounting software does it work with?
    a: Xero and QuickBooks are the most common, and FreeAgent and Sage also work. If you use something else, we check on the audit call whether it has a connection we can use.
  - q: Will it upset my customers?
    a: The messages are written with you, in your tone, and start gently. Most customers are simply busy and appreciate a clear reminder with a payment link. You can exclude any customer from automatic reminders.
  - q: Can it add late payment interest?
    a: In the UK, businesses can usually claim statutory interest and compensation on late commercial debts. The reminders can mention your terms, but we recommend you check how you want to apply this with your accountant first.
  - q: What happens if the connection to Xero or QuickBooks stops?
    a: If a connection drops, reminders pause rather than send wrong messages, and you get an alert. We show you how to reconnect it in a minute, and fixes for anything we built wrongly are covered during the post-launch support period.
  - q: How long does it take?
    a: Most invoice reminder set-ups are live within one to two weeks.
---

## How automated invoice chasing works

The automation checks your accounting software every day. For each unpaid invoice it looks at the due date and sends the right message at the right time. As soon as Xero or QuickBooks marks the invoice as paid, the reminders stop. There is nothing for you to remember.

A typical schedule looks like this (you choose the exact timing):

1. **3 days before due:** a friendly heads-up with the invoice attached.
2. **On the due date:** a short reminder with a pay-now link.
3. **7 days late:** a polite follow-up by email and WhatsApp.
4. **14 days late:** a firmer note that refers to your payment terms.
5. **21 days late:** an alert to you to make a personal call.

## Tools we use

We build on tools common in UK small businesses: **Xero**, **QuickBooks**, **FreeAgent** and **Sage** for accounts, **n8n** or **Make** for the automation, and the **WhatsApp Business Platform** for messages. Where possible, everything runs on accounts in your name, so you own it.

## More admin you can automate

Invoice chasing is often the first automation, because the payback is clear. The same approach works for booking reminders, review requests and follow-ups. See [online booking and reminders](/business/online-booking-system/), or ask about a broader [AI agent](/services/ai-agents/) that answers and logs enquiries for you.
