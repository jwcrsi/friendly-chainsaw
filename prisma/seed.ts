import { PrismaClient } from "../src/generated/prisma/client.ts";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const businessData = [
  { name: "The Rustic Table", category: "Restaurant", subcategory: "American", description: "Farm-to-table American restaurant serving locally sourced dishes in a cozy atmosphere.", phone: "(415) 555-0101", email: "info@rustictable.com", website: "rustictable.com", address: "123 Market St", city: "San Francisco", state: "CA", zipCode: "94105", googleRating: 4.6, reviewCount: 342, re2Score: 92, facebook: "facebook.com/rustictable", instagram: "@rustictable", yearEstablished: 2018, employeeCount: 25, annualRevenue: "$1M-$5M" },
  { name: "Sakura Sushi Bar", category: "Restaurant", subcategory: "Japanese", description: "Authentic Japanese sushi and omakase dining experience.", phone: "(415) 555-0102", email: "hello@sakurasushi.com", website: "sakurasushi.com", address: "456 Geary St", city: "San Francisco", state: "CA", zipCode: "94102", googleRating: 4.8, reviewCount: 521, re2Score: 95, facebook: "facebook.com/sakurasushi", instagram: "@sakurasushibar", yearEstablished: 2015, employeeCount: 18, annualRevenue: "$500K-$1M" },
  { name: "Green Leaf Cafe", category: "Coffee Shop", subcategory: "Cafe", description: "Organic coffee and plant-based food in an eco-friendly space.", phone: "(415) 555-0103", email: "contact@greenleafcafe.com", website: "greenleafcafe.com", address: "789 Valencia St", city: "San Francisco", state: "CA", zipCode: "94110", googleRating: 4.5, reviewCount: 198, re2Score: 78, instagram: "@greenleafcafe", yearEstablished: 2020, employeeCount: 8, annualRevenue: "$100K-$500K" },
  { name: "Iron & Lace Salon", category: "Salon & Spa", subcategory: "Hair Salon", description: "Full-service hair salon offering cuts, color, and styling for all hair types.", phone: "(310) 555-0201", email: "appointments@ironlace.com", website: "ironlacesalon.com", address: "1200 Sunset Blvd", city: "Los Angeles", state: "CA", zipCode: "90026", googleRating: 4.7, reviewCount: 276, re2Score: 85, facebook: "facebook.com/ironlacesalon", instagram: "@ironlacesalon", yearEstablished: 2017, employeeCount: 12, annualRevenue: "$500K-$1M" },
  { name: "FitZone CrossFit", category: "Fitness", subcategory: "CrossFit", description: "High-intensity CrossFit gym with certified coaches and community vibe.", phone: "(310) 555-0202", email: "join@fitzonecf.com", website: "fitzonecrossfit.com", address: "3400 Motor Ave", city: "Los Angeles", state: "CA", zipCode: "90034", googleRating: 4.4, reviewCount: 167, re2Score: 72, instagram: "@fitzonecf", yearEstablished: 2019, employeeCount: 10, annualRevenue: "$250K-$500K" },
  { name: "Downtown Dental Group", category: "Medical", subcategory: "Dentistry", description: "Family dentistry practice offering general and cosmetic dental services.", phone: "(212) 555-0301", email: "info@downtowndental.com", website: "downtowndental.com", address: "55 Broadway", city: "New York", state: "NY", zipCode: "10006", googleRating: 4.3, reviewCount: 412, re2Score: 88, facebook: "facebook.com/downtowndental", linkedin: "linkedin.com/company/downtowndental", yearEstablished: 2010, employeeCount: 20, annualRevenue: "$1M-$5M" },
  { name: "Brooklyn Brew Works", category: "Bar & Nightlife", subcategory: "Brewery", description: "Craft brewery and taproom featuring rotating seasonal beers.", phone: "(718) 555-0302", email: "events@brooklynbrew.com", website: "brooklynbrewworks.com", address: "200 Kent Ave", city: "Brooklyn", state: "NY", zipCode: "11249", googleRating: 4.5, reviewCount: 634, re2Score: 91, facebook: "facebook.com/brooklynbrewworks", instagram: "@brooklynbrewworks", yearEstablished: 2016, employeeCount: 15, annualRevenue: "$500K-$1M" },
  { name: "Quick Fix Auto", category: "Auto Services", subcategory: "Auto Repair", description: "Reliable auto repair shop specializing in foreign and domestic vehicles.", phone: "(713) 555-0401", email: "service@quickfixauto.com", website: "quickfixauto.com", address: "8800 Westheimer Rd", city: "Houston", state: "TX", zipCode: "77063", googleRating: 4.2, reviewCount: 189, re2Score: 65, facebook: "facebook.com/quickfixauto", yearEstablished: 2014, employeeCount: 8, annualRevenue: "$250K-$500K" },
  { name: "Magnolia Home Design", category: "Home Services", subcategory: "Interior Design", description: "Boutique interior design studio for residential and small commercial spaces.", phone: "(512) 555-0402", email: "hello@magnoliahd.com", website: "magnoliahomedesign.com", address: "1600 S Congress Ave", city: "Austin", state: "TX", zipCode: "78704", googleRating: 4.9, reviewCount: 87, re2Score: 76, instagram: "@magnoliahomedesign", yearEstablished: 2021, employeeCount: 5, annualRevenue: "$100K-$500K" },
  { name: "Peach State Plumbing", category: "Home Services", subcategory: "Plumbing", description: "Licensed residential and commercial plumbing services.", phone: "(404) 555-0501", email: "service@peachstateplumbing.com", website: "peachstateplumbing.com", address: "3200 Peachtree Rd NE", city: "Atlanta", state: "GA", zipCode: "30305", googleRating: 4.1, reviewCount: 234, re2Score: 70, facebook: "facebook.com/peachstateplumbing", yearEstablished: 2012, employeeCount: 14, annualRevenue: "$500K-$1M" },
  { name: "Bright Smiles Pediatrics", category: "Medical", subcategory: "Pediatric Dentistry", description: "Kid-friendly dental office with a focus on preventive care.", phone: "(305) 555-0601", email: "info@brightsmilespediatrics.com", website: "brightsmilespediatrics.com", address: "900 Brickell Ave", city: "Miami", state: "FL", zipCode: "33131", googleRating: 4.7, reviewCount: 156, re2Score: 82, facebook: "facebook.com/brightsmilespeds", instagram: "@brightsmilespeds", yearEstablished: 2019, employeeCount: 10, annualRevenue: "$500K-$1M" },
  { name: "Vintage Threads Boutique", category: "Retail", subcategory: "Clothing", description: "Curated vintage and secondhand clothing for men and women.", phone: "(503) 555-0701", email: "shop@vintagethreads.com", website: "vintagethreadsboutique.com", address: "2100 NW Glisan St", city: "Portland", state: "OR", zipCode: "97210", googleRating: 4.6, reviewCount: 203, re2Score: 77, instagram: "@vintagethreadspnw", yearEstablished: 2018, employeeCount: 6, annualRevenue: "$100K-$500K" },
  { name: "Pacific Yoga Studio", category: "Fitness", subcategory: "Yoga", description: "Vinyasa and restorative yoga classes for all levels.", phone: "(206) 555-0801", email: "namaste@pacificyoga.com", website: "pacificyogastudio.com", address: "400 Pike St", city: "Seattle", state: "WA", zipCode: "98101", googleRating: 4.8, reviewCount: 312, re2Score: 89, facebook: "facebook.com/pacificyoga", instagram: "@pacificyogaseattle", yearEstablished: 2016, employeeCount: 10, annualRevenue: "$250K-$500K" },
  { name: "Golden Wok Chinese", category: "Restaurant", subcategory: "Chinese", description: "Traditional Sichuan and Cantonese cuisine in a family-friendly setting.", phone: "(312) 555-0901", email: "order@goldenwok.com", website: "goldenwokchicago.com", address: "2200 S Wentworth Ave", city: "Chicago", state: "IL", zipCode: "60616", googleRating: 4.3, reviewCount: 445, re2Score: 81, facebook: "facebook.com/goldenwokchi", yearEstablished: 2008, employeeCount: 20, annualRevenue: "$500K-$1M" },
  { name: "Summit Tax Advisors", category: "Professional Services", subcategory: "Accounting", description: "CPA firm specializing in small business tax preparation and bookkeeping.", phone: "(303) 555-1001", email: "info@summittax.com", website: "summittaxadvisors.com", address: "1700 Lincoln St", city: "Denver", state: "CO", zipCode: "80203", googleRating: 4.4, reviewCount: 98, re2Score: 73, linkedin: "linkedin.com/company/summittax", yearEstablished: 2015, employeeCount: 7, annualRevenue: "$250K-$500K" },
  { name: "Sunset Pet Grooming", category: "Retail", subcategory: "Pet Services", description: "Full-service pet grooming salon for dogs and cats of all breeds.", phone: "(602) 555-1101", email: "woof@sunsetpetgrooming.com", website: "sunsetpetgrooming.com", address: "4500 E Camelback Rd", city: "Phoenix", state: "AZ", zipCode: "85018", googleRating: 4.6, reviewCount: 178, re2Score: 68, facebook: "facebook.com/sunsetpetgrooming", instagram: "@sunsetpetgrooming", yearEstablished: 2020, employeeCount: 6, annualRevenue: "$100K-$500K" },
  { name: "Liberty Bell Pizza", category: "Restaurant", subcategory: "Pizza", description: "New York-style pizza and Italian-American classics since 1995.", phone: "(215) 555-1201", email: "eat@libertybellpizza.com", website: "libertybellpizza.com", address: "350 South St", city: "Philadelphia", state: "PA", zipCode: "19147", googleRating: 4.5, reviewCount: 789, re2Score: 94, facebook: "facebook.com/libertybellpizza", instagram: "@libertybellpizza", yearEstablished: 1995, employeeCount: 30, annualRevenue: "$1M-$5M" },
  { name: "Emerald City Florist", category: "Retail", subcategory: "Florist", description: "Custom floral arrangements for weddings, events, and everyday occasions.", phone: "(206) 555-1301", email: "flowers@emeraldcityflorist.com", website: "emeraldcityflorist.com", address: "600 Pine St", city: "Seattle", state: "WA", zipCode: "98101", googleRating: 4.7, reviewCount: 134, re2Score: 71, instagram: "@emeraldcityflorist", yearEstablished: 2017, employeeCount: 5, annualRevenue: "$100K-$500K" },
  { name: "River City Chiropractic", category: "Medical", subcategory: "Chiropractic", description: "Chiropractic care, massage therapy, and holistic wellness services.", phone: "(615) 555-1401", email: "health@rivercitychiro.com", website: "rivercitychiro.com", address: "210 Broadway", city: "Nashville", state: "TN", zipCode: "37203", googleRating: 4.4, reviewCount: 221, re2Score: 75, facebook: "facebook.com/rivercitychiro", yearEstablished: 2013, employeeCount: 8, annualRevenue: "$250K-$500K" },
  { name: "Maverick Marketing Co", category: "Professional Services", subcategory: "Marketing Agency", description: "Digital marketing agency helping local businesses grow online.", phone: "(214) 555-1501", email: "hello@maverickmarketing.com", website: "maverickmarketingco.com", address: "2800 Main St", city: "Dallas", state: "TX", zipCode: "75226", googleRating: 4.8, reviewCount: 67, re2Score: 84, linkedin: "linkedin.com/company/maverickmarketing", instagram: "@maverickmarketingco", yearEstablished: 2019, employeeCount: 12, annualRevenue: "$500K-$1M" },
  { name: "Bayfront Seafood Grill", category: "Restaurant", subcategory: "Seafood", description: "Fresh Gulf seafood with waterfront dining and stunning sunset views.", phone: "(727) 555-1601", email: "dine@bayfrontseafood.com", website: "bayfrontseafoodgrill.com", address: "800 2nd Ave NE", city: "St. Petersburg", state: "FL", zipCode: "33701", googleRating: 4.5, reviewCount: 567, re2Score: 87, facebook: "facebook.com/bayfrontseafood", instagram: "@bayfrontseafood", yearEstablished: 2011, employeeCount: 35, annualRevenue: "$1M-$5M" },
  { name: "Mile High Barbershop", category: "Salon & Spa", subcategory: "Barbershop", description: "Classic barbershop with modern cuts, hot towel shaves, and beard trims.", phone: "(303) 555-1701", email: "book@milehighbarber.com", website: "milehighbarbershop.com", address: "1400 Larimer St", city: "Denver", state: "CO", zipCode: "80202", googleRating: 4.6, reviewCount: 245, re2Score: 79, instagram: "@milehighbarber", yearEstablished: 2018, employeeCount: 6, annualRevenue: "$100K-$500K" },
  { name: "Sunshine Daycare Center", category: "Professional Services", subcategory: "Childcare", description: "Licensed daycare providing nurturing care for children ages 6 weeks to 5 years.", phone: "(919) 555-1801", email: "enroll@sunshinedaycare.com", website: "sunshinedaycare.com", address: "500 Fayetteville St", city: "Raleigh", state: "NC", zipCode: "27601", googleRating: 4.3, reviewCount: 89, re2Score: 66, facebook: "facebook.com/sunshinedaycarenc", yearEstablished: 2016, employeeCount: 15, annualRevenue: "$250K-$500K" },
  { name: "Copper & Oak Winery", category: "Bar & Nightlife", subcategory: "Wine Bar", description: "Boutique wine bar featuring local and imported wines with artisan cheese boards.", phone: "(707) 555-1901", email: "visit@copperandoak.com", website: "copperandoak.com", address: "1300 1st St", city: "Napa", state: "CA", zipCode: "94559", googleRating: 4.9, reviewCount: 312, re2Score: 93, facebook: "facebook.com/copperandoak", instagram: "@copperandoak", yearEstablished: 2014, employeeCount: 10, annualRevenue: "$500K-$1M" },
  { name: "TechShield IT Solutions", category: "Professional Services", subcategory: "IT Services", description: "Managed IT services, cybersecurity, and cloud solutions for SMBs.", phone: "(408) 555-2001", email: "support@techshieldit.com", website: "techshieldit.com", address: "100 W San Fernando St", city: "San Jose", state: "CA", zipCode: "95113", googleRating: 4.2, reviewCount: 76, re2Score: 69, linkedin: "linkedin.com/company/techshieldit", yearEstablished: 2017, employeeCount: 20, annualRevenue: "$1M-$5M" },
];

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const hashedPassword = await hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@re2.ai" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@re2.ai",
      hashedPassword,
      role: "admin",
    },
  });
  console.log(`Created user: ${user.email}`);

  // Create businesses
  for (const biz of businessData) {
    await prisma.business.create({ data: biz });
  }
  console.log(`Created ${businessData.length} businesses`);

  // Create sample lists
  const list1 = await prisma.list.create({
    data: {
      name: "SF Restaurants",
      description: "Top restaurants in San Francisco for Q1 outreach",
      userId: user.id,
    },
  });
  const list2 = await prisma.list.create({
    data: {
      name: "High Score Prospects",
      description: "Businesses with RE2 score above 85",
      userId: user.id,
    },
  });
  console.log("Created sample lists");

  // Add businesses to lists
  const allBusinesses = await prisma.business.findMany();
  const sfRestaurants = allBusinesses.filter(b => b.city === "San Francisco" && b.category === "Restaurant");
  for (const biz of sfRestaurants) {
    await prisma.listItem.create({
      data: { listId: list1.id, businessId: biz.id },
    });
  }
  const highScoreBiz = allBusinesses.filter(b => b.re2Score >= 85);
  for (const biz of highScoreBiz) {
    await prisma.listItem.create({
      data: { listId: list2.id, businessId: biz.id },
    });
  }

  // Create sample campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      name: "Q1 Restaurant Outreach",
      subject: "Partnership opportunity for your restaurant",
      body: "Hi {{business_name}},\n\nI came across your restaurant and was impressed by your reviews and online presence. I'd love to discuss how we can help you reach more local customers.\n\nWould you be open to a quick call this week?\n\nBest regards",
      status: "active",
      listId: list1.id,
      userId: user.id,
      totalSent: 45,
      totalOpened: 32,
      totalReplied: 12,
      totalBounced: 2,
    },
  });
  await prisma.campaign.create({
    data: {
      name: "High-Value Prospect Intro",
      subject: "Exclusive offer for top-rated businesses",
      body: "Dear {{business_name}} team,\n\nYour business stands out as a leader in your category. We work with similar businesses to help them grow revenue through targeted local marketing.\n\nI'd love to share some ideas with you.\n\nBest",
      status: "draft",
      listId: list2.id,
      userId: user.id,
      totalSent: 0,
      totalOpened: 0,
      totalReplied: 0,
      totalBounced: 0,
    },
  });
  console.log("Created sample campaigns");

  // Create sample outreach emails
  for (const biz of sfRestaurants) {
    await prisma.outreachEmail.create({
      data: {
        campaignId: campaign1.id,
        businessId: biz.id,
        userId: user.id,
        channel: "email",
        subject: "Partnership opportunity for your restaurant",
        body: "Hi, I'd love to discuss a partnership...",
        status: "sent",
        sentAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Create sample deals
  const dealData = [
    { title: "Annual Marketing Package", value: 24000, stage: "proposal", priority: "high", businessId: allBusinesses[0].id },
    { title: "Website Redesign", value: 8500, stage: "negotiation", priority: "high", businessId: allBusinesses[1].id },
    { title: "Social Media Management", value: 12000, stage: "contacted", priority: "medium", businessId: allBusinesses[3].id },
    { title: "SEO Optimization", value: 6000, stage: "meeting", priority: "medium", businessId: allBusinesses[6].id },
    { title: "Brand Identity Package", value: 15000, stage: "lead", priority: "low", businessId: allBusinesses[8].id },
    { title: "Email Marketing Setup", value: 4500, stage: "closed_won", priority: "medium", businessId: allBusinesses[10].id },
    { title: "PPC Campaign", value: 18000, stage: "proposal", priority: "high", businessId: allBusinesses[13].id },
    { title: "Content Strategy", value: 9000, stage: "contacted", priority: "low", businessId: allBusinesses[16].id },
    { title: "Local SEO Package", value: 5500, stage: "closed_won", priority: "medium", businessId: allBusinesses[18].id },
    { title: "Full Digital Overhaul", value: 35000, stage: "negotiation", priority: "high", businessId: allBusinesses[20].id },
  ];

  for (const deal of dealData) {
    await prisma.deal.create({
      data: { ...deal, userId: user.id },
    });
  }
  console.log("Created sample deals");

  // Create sample activities
  const activityData = [
    { type: "email_sent", title: "Sent outreach email to The Rustic Table", businessId: allBusinesses[0].id },
    { type: "email_opened", title: "Email opened by Sakura Sushi Bar", businessId: allBusinesses[1].id },
    { type: "deal_created", title: "Created deal: Annual Marketing Package", businessId: allBusinesses[0].id },
    { type: "email_sent", title: "Sent follow-up to Iron & Lace Salon", businessId: allBusinesses[3].id },
    { type: "deal_stage_changed", title: "Deal moved to Negotiation: Website Redesign", businessId: allBusinesses[1].id },
    { type: "call_made", title: "Call with Downtown Dental Group", businessId: allBusinesses[5].id },
    { type: "email_sent", title: "Sent intro email to Brooklyn Brew Works", businessId: allBusinesses[6].id },
    { type: "note_added", title: "Added note about budget discussion", businessId: allBusinesses[8].id },
    { type: "deal_created", title: "Created deal: Email Marketing Setup", businessId: allBusinesses[10].id },
    { type: "email_opened", title: "Email opened by Liberty Bell Pizza", businessId: allBusinesses[16].id },
  ];

  for (const activity of activityData) {
    await prisma.activity.create({
      data: { ...activity, userId: user.id },
    });
  }
  console.log("Created sample activities");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
