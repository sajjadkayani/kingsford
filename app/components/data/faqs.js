export const faqs = [
  {
    category: 'Ordering',
    items: [
      {
        question: 'Are your beds really made in the UK?',
        answer: 'Yes, every single bed is handcrafted in our UK factory. We do not import or resell. When you order from Kingsford Sleep, your bed is built from scratch by our team of skilled craftsmen.',
      },
      {
        question: 'How do I place an order?',
        answer: 'Use our bed configurator to choose your bed, size, fabric and colour. You will get an instant quote. Then submit your order via the form or send us a WhatsApp message and we will take care of the rest.',
      },
      {
        question: 'Can I choose a custom size?',
        answer: 'Absolutely. We build to order so we can accommodate non-standard sizes. Get in touch via WhatsApp or email with your measurements and we will provide a custom quote.',
      },
      {
        question: 'Do I need to pay a deposit?',
        answer: 'We require a 50% deposit to start production, with the remaining balance due before delivery. We accept bank transfer and major debit/credit cards.',
      },
    ],
  },
  {
    category: 'Products',
    items: [
      {
        question: 'What fabrics are available?',
        answer: 'We currently offer Velvet, Linen, Chenille and Faux Leather across a wide range of colours. New fabrics are added regularly. If you have something specific in mind, contact us.',
      },
      {
        question: 'How many colour options do you have?',
        answer: 'We offer over 40 colours across our fabric range. From neutral creams and greys to rich navies, emeralds and burgundies. You can see all available colours in our bed configurator.',
      },
      {
        question: 'Can I see fabric samples before ordering?',
        answer: 'Yes. Contact us via WhatsApp or email and we will send you fabric swatches free of charge so you can see and feel the quality before committing.',
      },
      {
        question: 'What mattress sizes do you cater for?',
        answer: 'We build beds for all standard UK sizes: Single (90cm), Small Double (120cm), Double (135cm), King (150cm) and Super King (180cm). Custom sizes are also available.',
      },
    ],
  },
  {
    category: 'Delivery',
    items: [
      {
        question: 'How long does delivery take?',
        answer: 'Most beds are ready within 3 to 4 weeks from order confirmation. We will keep you updated throughout and contact you to arrange a delivery time that suits you.',
      },
      {
        question: 'Do you deliver across the whole UK?',
        answer: 'Yes, we deliver free of charge to all mainland UK addresses. For Scotland, Northern Ireland and remote areas, please contact us to confirm delivery before ordering.',
      },
      {
        question: 'What does the delivery include?',
        answer: 'Our delivery team will bring the bed to your room of choice, fully assemble it, and remove all packaging. You do not need to lift a finger.',
      },
      {
        question: 'Can I track my order?',
        answer: 'Yes. Once your bed is dispatched you will receive a tracking number and our team will be in touch to confirm your delivery slot.',
      },
    ],
  },
  {
    category: 'After Purchase',
    items: [
      {
        question: 'What is your returns policy?',
        answer: 'Because every bed is made to order to your exact specifications, we are unable to accept returns unless the product is faulty. We recommend requesting fabric samples and carefully checking your order before confirming.',
      },
      {
        question: 'What warranty do you offer?',
        answer: 'All Kingsford Sleep beds come with a 2-year manufacturing warranty covering defects in materials and workmanship. Normal wear and tear is not covered.',
      },
      {
        question: 'How do I care for my bed?',
        answer: 'Vacuum upholstered surfaces regularly. For spot cleaning use a dry cloth — avoid soaking the fabric. Keep away from direct sunlight to prevent fading. Full care instructions are included with every delivery.',
      },
    ],
  },
]

// Flat list for the homepage FAQ section
export const homepageFaqs = faqs.flatMap(cat => cat.items).slice(0, 6)
