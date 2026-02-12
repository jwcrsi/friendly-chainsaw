const Database = require("better-sqlite3");
const { hashSync } = require("bcryptjs");
const path = require("path");
const crypto = require("crypto");

const db = new Database(path.join(__dirname, "dev.db"));

function cuid() {
  return crypto.randomBytes(12).toString("hex");
}

const now = new Date().toISOString();

console.log("Seeding database...");

// Create demo user
const hashedPassword = hashSync("password123", 12);
const userId = cuid();
db.prepare(
  `INSERT OR IGNORE INTO User (id, name, email, hashedPassword, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
).run(userId, "Demo User", "demo@re2.ai", hashedPassword, "admin", now, now);
console.log("Created user: demo@re2.ai");

// Create businesses
const businessData = [
  { name: "The Rustic Table", category: "Restaurant", subcategory: "American", description: "Farm-to-table American restaurant serving locally sourced dishes in a cozy atmosphere.", phone: "(415) 555-0101", email: "info@rustictable.com", website: "rustictable.com", address: "123 Market St", city: "San Francisco", state: "CA", zipCode: "94105", googleRating: 4.6, reviewCount: 342, re2Score: 92, facebook: "facebook.com/rustictable", instagram: "@rustictable", yearEstablished: 2018, employeeCount: 25, annualRevenue: "$1M-$5M" },
  { name: "Sakura Sushi Bar", category: "Restaurant", subcategory: "Japanese", description: "Authentic Japanese sushi and omakase dining experience.", phone: "(415) 555-0102", email: "hello@sakurasushi.com", website: "sakurasushi.com", address: "456 Geary St", city: "San Francisco", state: "CA", zipCode: "94102", googleRating: 4.8, reviewCount: 521, re2Score: 95, facebook: "facebook.com/sakurasushi", instagram: "@sakurasushibar", yearEstablished: 2015, employeeCount: 18, annualRevenue: "$500K-$1M" },
  { name: "Green Leaf Cafe", category: "Coffee Shop", subcategory: "Cafe", description: "Organic coffee and plant-based food in an eco-friendly space.", phone: "(415) 555-0103", email: "contact@greenleafcafe.com", website: "greenleafcafe.com", address: "789 Valencia St", city: "San Francisco", state: "CA", zipCode: "94110", googleRating: 4.5, reviewCount: 198, re2Score: 78, facebook: null, instagram: "@greenleafcafe", yearEstablished: 2020, employeeCount: 8, annualRevenue: "$100K-$500K" },
  { name: "Iron & Lace Salon", category: "Salon & Spa", subcategory: "Hair Salon", description: "Full-service hair salon offering cuts, color, and styling for all hair types.", phone: "(310) 555-0201", email: "appointments@ironlace.com", website: "ironlacesalon.com", address: "1200 Sunset Blvd", city: "Los Angeles", state: "CA", zipCode: "90026", googleRating: 4.7, reviewCount: 276, re2Score: 85, facebook: "facebook.com/ironlacesalon", instagram: "@ironlacesalon", yearEstablished: 2017, employeeCount: 12, annualRevenue: "$500K-$1M" },
  { name: "FitZone CrossFit", category: "Fitness", subcategory: "CrossFit", description: "High-intensity CrossFit gym with certified coaches and community vibe.", phone: "(310) 555-0202", email: "join@fitzonecf.com", website: "fitzonecrossfit.com", address: "3400 Motor Ave", city: "Los Angeles", state: "CA", zipCode: "90034", googleRating: 4.4, reviewCount: 167, re2Score: 72, facebook: null, instagram: "@fitzonecf", yearEstablished: 2019, employeeCount: 10, annualRevenue: "$250K-$500K" },
  { name: "Downtown Dental Group", category: "Medical", subcategory: "Dentistry", description: "Family dentistry practice offering general and cosmetic dental services.", phone: "(212) 555-0301", email: "info@downtowndental.com", website: "downtowndental.com", address: "55 Broadway", city: "New York", state: "NY", zipCode: "10006", googleRating: 4.3, reviewCount: 412, re2Score: 88, facebook: "facebook.com/downtowndental", instagram: null, yearEstablished: 2010, employeeCount: 20, annualRevenue: "$1M-$5M", linkedin: "linkedin.com/company/downtowndental" },
  { name: "Brooklyn Brew Works", category: "Bar & Nightlife", subcategory: "Brewery", description: "Craft brewery and taproom featuring rotating seasonal beers.", phone: "(718) 555-0302", email: "events@brooklynbrew.com", website: "brooklynbrewworks.com", address: "200 Kent Ave", city: "Brooklyn", state: "NY", zipCode: "11249", googleRating: 4.5, reviewCount: 634, re2Score: 91, facebook: "facebook.com/brooklynbrewworks", instagram: "@brooklynbrewworks", yearEstablished: 2016, employeeCount: 15, annualRevenue: "$500K-$1M" },
  { name: "Quick Fix Auto", category: "Auto Services", subcategory: "Auto Repair", description: "Reliable auto repair shop specializing in foreign and domestic vehicles.", phone: "(713) 555-0401", email: "service@quickfixauto.com", website: "quickfixauto.com", address: "8800 Westheimer Rd", city: "Houston", state: "TX", zipCode: "77063", googleRating: 4.2, reviewCount: 189, re2Score: 65, facebook: "facebook.com/quickfixauto", instagram: null, yearEstablished: 2014, employeeCount: 8, annualRevenue: "$250K-$500K" },
  { name: "Magnolia Home Design", category: "Home Services", subcategory: "Interior Design", description: "Boutique interior design studio for residential and small commercial spaces.", phone: "(512) 555-0402", email: "hello@magnoliahd.com", website: "magnoliahomedesign.com", address: "1600 S Congress Ave", city: "Austin", state: "TX", zipCode: "78704", googleRating: 4.9, reviewCount: 87, re2Score: 76, facebook: null, instagram: "@magnoliahomedesign", yearEstablished: 2021, employeeCount: 5, annualRevenue: "$100K-$500K" },
  { name: "Peach State Plumbing", category: "Home Services", subcategory: "Plumbing", description: "Licensed residential and commercial plumbing services.", phone: "(404) 555-0501", email: "service@peachstateplumbing.com", website: "peachstateplumbing.com", address: "3200 Peachtree Rd NE", city: "Atlanta", state: "GA", zipCode: "30305", googleRating: 4.1, reviewCount: 234, re2Score: 70, facebook: "facebook.com/peachstateplumbing", instagram: null, yearEstablished: 2012, employeeCount: 14, annualRevenue: "$500K-$1M" },
  { name: "Bright Smiles Pediatrics", category: "Medical", subcategory: "Pediatric Dentistry", description: "Kid-friendly dental office with a focus on preventive care.", phone: "(305) 555-0601", email: "info@brightsmilespediatrics.com", website: "brightsmilespediatrics.com", address: "900 Brickell Ave", city: "Miami", state: "FL", zipCode: "33131", googleRating: 4.7, reviewCount: 156, re2Score: 82, facebook: "facebook.com/brightsmilespeds", instagram: "@brightsmilespeds", yearEstablished: 2019, employeeCount: 10, annualRevenue: "$500K-$1M" },
  { name: "Vintage Threads Boutique", category: "Retail", subcategory: "Clothing", description: "Curated vintage and secondhand clothing for men and women.", phone: "(503) 555-0701", email: "shop@vintagethreads.com", website: "vintagethreadsboutique.com", address: "2100 NW Glisan St", city: "Portland", state: "OR", zipCode: "97210", googleRating: 4.6, reviewCount: 203, re2Score: 77, facebook: null, instagram: "@vintagethreadspnw", yearEstablished: 2018, employeeCount: 6, annualRevenue: "$100K-$500K" },
  { name: "Pacific Yoga Studio", category: "Fitness", subcategory: "Yoga", description: "Vinyasa and restorative yoga classes for all levels.", phone: "(206) 555-0801", email: "namaste@pacificyoga.com", website: "pacificyogastudio.com", address: "400 Pike St", city: "Seattle", state: "WA", zipCode: "98101", googleRating: 4.8, reviewCount: 312, re2Score: 89, facebook: "facebook.com/pacificyoga", instagram: "@pacificyogaseattle", yearEstablished: 2016, employeeCount: 10, annualRevenue: "$250K-$500K" },
  { name: "Golden Wok Chinese", category: "Restaurant", subcategory: "Chinese", description: "Traditional Sichuan and Cantonese cuisine in a family-friendly setting.", phone: "(312) 555-0901", email: "order@goldenwok.com", website: "goldenwokchicago.com", address: "2200 S Wentworth Ave", city: "Chicago", state: "IL", zipCode: "60616", googleRating: 4.3, reviewCount: 445, re2Score: 81, facebook: "facebook.com/goldenwokchi", instagram: null, yearEstablished: 2008, employeeCount: 20, annualRevenue: "$500K-$1M" },
  { name: "Summit Tax Advisors", category: "Professional Services", subcategory: "Accounting", description: "CPA firm specializing in small business tax preparation and bookkeeping.", phone: "(303) 555-1001", email: "info@summittax.com", website: "summittaxadvisors.com", address: "1700 Lincoln St", city: "Denver", state: "CO", zipCode: "80203", googleRating: 4.4, reviewCount: 98, re2Score: 73, facebook: null, instagram: null, yearEstablished: 2015, employeeCount: 7, annualRevenue: "$250K-$500K", linkedin: "linkedin.com/company/summittax" },
  { name: "Sunset Pet Grooming", category: "Retail", subcategory: "Pet Services", description: "Full-service pet grooming salon for dogs and cats of all breeds.", phone: "(602) 555-1101", email: "woof@sunsetpetgrooming.com", website: "sunsetpetgrooming.com", address: "4500 E Camelback Rd", city: "Phoenix", state: "AZ", zipCode: "85018", googleRating: 4.6, reviewCount: 178, re2Score: 68, facebook: "facebook.com/sunsetpetgrooming", instagram: "@sunsetpetgrooming", yearEstablished: 2020, employeeCount: 6, annualRevenue: "$100K-$500K" },
  { name: "Liberty Bell Pizza", category: "Restaurant", subcategory: "Pizza", description: "New York-style pizza and Italian-American classics since 1995.", phone: "(215) 555-1201", email: "eat@libertybellpizza.com", website: "libertybellpizza.com", address: "350 South St", city: "Philadelphia", state: "PA", zipCode: "19147", googleRating: 4.5, reviewCount: 789, re2Score: 94, facebook: "facebook.com/libertybellpizza", instagram: "@libertybellpizza", yearEstablished: 1995, employeeCount: 30, annualRevenue: "$1M-$5M" },
  { name: "Emerald City Florist", category: "Retail", subcategory: "Florist", description: "Custom floral arrangements for weddings, events, and everyday occasions.", phone: "(206) 555-1301", email: "flowers@emeraldcityflorist.com", website: "emeraldcityflorist.com", address: "600 Pine St", city: "Seattle", state: "WA", zipCode: "98101", googleRating: 4.7, reviewCount: 134, re2Score: 71, facebook: null, instagram: "@emeraldcityflorist", yearEstablished: 2017, employeeCount: 5, annualRevenue: "$100K-$500K" },
  { name: "River City Chiropractic", category: "Medical", subcategory: "Chiropractic", description: "Chiropractic care, massage therapy, and holistic wellness services.", phone: "(615) 555-1401", email: "health@rivercitychiro.com", website: "rivercitychiro.com", address: "210 Broadway", city: "Nashville", state: "TN", zipCode: "37203", googleRating: 4.4, reviewCount: 221, re2Score: 75, facebook: "facebook.com/rivercitychiro", instagram: null, yearEstablished: 2013, employeeCount: 8, annualRevenue: "$250K-$500K" },
  { name: "Maverick Marketing Co", category: "Professional Services", subcategory: "Marketing Agency", description: "Digital marketing agency helping local businesses grow online.", phone: "(214) 555-1501", email: "hello@maverickmarketing.com", website: "maverickmarketingco.com", address: "2800 Main St", city: "Dallas", state: "TX", zipCode: "75226", googleRating: 4.8, reviewCount: 67, re2Score: 84, facebook: null, instagram: "@maverickmarketingco", yearEstablished: 2019, employeeCount: 12, annualRevenue: "$500K-$1M", linkedin: "linkedin.com/company/maverickmarketing" },
  { name: "Bayfront Seafood Grill", category: "Restaurant", subcategory: "Seafood", description: "Fresh Gulf seafood with waterfront dining and stunning sunset views.", phone: "(727) 555-1601", email: "dine@bayfrontseafood.com", website: "bayfrontseafoodgrill.com", address: "800 2nd Ave NE", city: "St. Petersburg", state: "FL", zipCode: "33701", googleRating: 4.5, reviewCount: 567, re2Score: 87, facebook: "facebook.com/bayfrontseafood", instagram: "@bayfrontseafood", yearEstablished: 2011, employeeCount: 35, annualRevenue: "$1M-$5M" },
  { name: "Mile High Barbershop", category: "Salon & Spa", subcategory: "Barbershop", description: "Classic barbershop with modern cuts, hot towel shaves, and beard trims.", phone: "(303) 555-1701", email: "book@milehighbarber.com", website: "milehighbarbershop.com", address: "1400 Larimer St", city: "Denver", state: "CO", zipCode: "80202", googleRating: 4.6, reviewCount: 245, re2Score: 79, facebook: null, instagram: "@milehighbarber", yearEstablished: 2018, employeeCount: 6, annualRevenue: "$100K-$500K" },
  { name: "Sunshine Daycare Center", category: "Professional Services", subcategory: "Childcare", description: "Licensed daycare providing nurturing care for children ages 6 weeks to 5 years.", phone: "(919) 555-1801", email: "enroll@sunshinedaycare.com", website: "sunshinedaycare.com", address: "500 Fayetteville St", city: "Raleigh", state: "NC", zipCode: "27601", googleRating: 4.3, reviewCount: 89, re2Score: 66, facebook: "facebook.com/sunshinedaycarenc", instagram: null, yearEstablished: 2016, employeeCount: 15, annualRevenue: "$250K-$500K" },
  { name: "Copper & Oak Winery", category: "Bar & Nightlife", subcategory: "Wine Bar", description: "Boutique wine bar featuring local and imported wines with artisan cheese boards.", phone: "(707) 555-1901", email: "visit@copperandoak.com", website: "copperandoak.com", address: "1300 1st St", city: "Napa", state: "CA", zipCode: "94559", googleRating: 4.9, reviewCount: 312, re2Score: 93, facebook: "facebook.com/copperandoak", instagram: "@copperandoak", yearEstablished: 2014, employeeCount: 10, annualRevenue: "$500K-$1M" },
  { name: "TechShield IT Solutions", category: "Professional Services", subcategory: "IT Services", description: "Managed IT services, cybersecurity, and cloud solutions for SMBs.", phone: "(408) 555-2001", email: "support@techshieldit.com", website: "techshieldit.com", address: "100 W San Fernando St", city: "San Jose", state: "CA", zipCode: "95113", googleRating: 4.2, reviewCount: 76, re2Score: 69, facebook: null, instagram: null, yearEstablished: 2017, employeeCount: 20, annualRevenue: "$1M-$5M", linkedin: "linkedin.com/company/techshieldit" },
];

const insertBiz = db.prepare(`INSERT INTO Business (id, name, category, subcategory, description, phone, email, website, address, city, state, zipCode, googleRating, reviewCount, re2Score, facebook, instagram, linkedin, yearEstablished, employeeCount, annualRevenue, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`);

const bizIds = [];
for (const b of businessData) {
  const id = cuid();
  bizIds.push(id);
  insertBiz.run(id, b.name, b.category, b.subcategory || null, b.description, b.phone, b.email, b.website, b.address, b.city, b.state, b.zipCode, b.googleRating, b.reviewCount, b.re2Score, b.facebook || null, b.instagram || null, b.linkedin || null, b.yearEstablished, b.employeeCount, b.annualRevenue, now, now);
}
console.log(`Created ${businessData.length} businesses`);

// Create lists
const list1Id = cuid();
const list2Id = cuid();
db.prepare(`INSERT INTO List (id, name, description, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`).run(list1Id, "SF Restaurants", "Top restaurants in San Francisco for Q1 outreach", userId, now, now);
db.prepare(`INSERT INTO List (id, name, description, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`).run(list2Id, "High Score Prospects", "Businesses with RE2 score above 85", userId, now, now);
console.log("Created sample lists");

// Add businesses to lists
const sfRestaurantIndices = [0, 1]; // The Rustic Table, Sakura Sushi Bar
for (const idx of sfRestaurantIndices) {
  db.prepare(`INSERT INTO ListItem (id, listId, businessId, status, addedAt) VALUES (?, ?, ?, 'new', ?)`).run(cuid(), list1Id, bizIds[idx], now);
}
const highScoreIndices = [0, 1, 3, 5, 6, 12, 16, 20, 23]; // re2Score >= 85
for (const idx of highScoreIndices) {
  db.prepare(`INSERT INTO ListItem (id, listId, businessId, status, addedAt) VALUES (?, ?, ?, 'new', ?)`).run(cuid(), list2Id, bizIds[idx], now);
}

// Create campaigns
const camp1Id = cuid();
db.prepare(`INSERT INTO Campaign (id, name, subject, body, status, listId, userId, totalSent, totalOpened, totalReplied, totalBounced, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(camp1Id, "Q1 Restaurant Outreach", "Partnership opportunity for your restaurant", "Hi,\n\nI came across your restaurant and was impressed by your reviews...", "active", list1Id, userId, 45, 32, 12, 2, now, now);
db.prepare(`INSERT INTO Campaign (id, name, subject, body, status, listId, userId, totalSent, totalOpened, totalReplied, totalBounced, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(cuid(), "High-Value Prospect Intro", "Exclusive offer for top-rated businesses", "Dear team,\n\nYour business stands out as a leader...", "draft", list2Id, userId, 0, 0, 0, 0, now, now);
console.log("Created sample campaigns");

// Create outreach emails
for (const idx of sfRestaurantIndices) {
  const sentAt = new Date(Date.now() - Math.random() * 7 * 86400000).toISOString();
  db.prepare(`INSERT INTO OutreachEmail (id, campaignId, businessId, userId, channel, subject, body, status, sentAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(cuid(), camp1Id, bizIds[idx], userId, "email", "Partnership opportunity", "Hi, I'd love to discuss a partnership...", "sent", sentAt, now);
}

// Create deals
const deals = [
  { title: "Annual Marketing Package", value: 24000, stage: "proposal", priority: "high", bizIdx: 0 },
  { title: "Website Redesign", value: 8500, stage: "negotiation", priority: "high", bizIdx: 1 },
  { title: "Social Media Management", value: 12000, stage: "contacted", priority: "medium", bizIdx: 3 },
  { title: "SEO Optimization", value: 6000, stage: "meeting", priority: "medium", bizIdx: 6 },
  { title: "Brand Identity Package", value: 15000, stage: "lead", priority: "low", bizIdx: 8 },
  { title: "Email Marketing Setup", value: 4500, stage: "closed_won", priority: "medium", bizIdx: 10 },
  { title: "PPC Campaign", value: 18000, stage: "proposal", priority: "high", bizIdx: 13 },
  { title: "Content Strategy", value: 9000, stage: "contacted", priority: "low", bizIdx: 16 },
  { title: "Local SEO Package", value: 5500, stage: "closed_won", priority: "medium", bizIdx: 18 },
  { title: "Full Digital Overhaul", value: 35000, stage: "negotiation", priority: "high", bizIdx: 20 },
];
for (const d of deals) {
  db.prepare(`INSERT INTO Deal (id, title, value, stage, priority, businessId, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(cuid(), d.title, d.value, d.stage, d.priority, bizIds[d.bizIdx], userId, now, now);
}
console.log("Created sample deals");

// Create activities
const activities = [
  { type: "email_sent", title: "Sent outreach email to The Rustic Table", bizIdx: 0 },
  { type: "email_opened", title: "Email opened by Sakura Sushi Bar", bizIdx: 1 },
  { type: "deal_created", title: "Created deal: Annual Marketing Package", bizIdx: 0 },
  { type: "email_sent", title: "Sent follow-up to Iron & Lace Salon", bizIdx: 3 },
  { type: "deal_stage_changed", title: "Deal moved to Negotiation", bizIdx: 1 },
  { type: "call_made", title: "Call with Downtown Dental Group", bizIdx: 5 },
  { type: "email_sent", title: "Sent intro email to Brooklyn Brew Works", bizIdx: 6 },
  { type: "note_added", title: "Added note about budget discussion", bizIdx: 8 },
  { type: "deal_created", title: "Created deal: Email Marketing Setup", bizIdx: 10 },
  { type: "email_opened", title: "Email opened by Liberty Bell Pizza", bizIdx: 16 },
];
for (const a of activities) {
  db.prepare(`INSERT INTO Activity (id, type, title, businessId, userId, createdAt) VALUES (?, ?, ?, ?, ?, ?)`).run(cuid(), a.type, a.title, bizIds[a.bizIdx], userId, now);
}
console.log("Created sample activities");

db.close();
console.log("Seeding complete!");
