// Hyper-Local Skill Data — Global
// City-specific skill recommendations for 50+ cities worldwide covering all industries

const LocalSkills = {
  cities: {
    // 🇮🇳 India
    visakhapatnam: {
      name: 'Visakhapatnam, India', region: 'Asia-Pacific',
      topSkills: ['Python', 'Java', 'Data Science', 'AWS', 'Full Stack', 'DevOps', 'Cyber Security', 'Cloud Computing', 'Project Management', 'Business Analysis', 'Digital Marketing', 'Financial Analysis'],
      trendingSkills: ['AI/ML', 'Kubernetes', 'MERN Stack', 'Blockchain', 'ESG Reporting', 'Supply Chain Analytics', 'Salesforce'],
      avgSalary: { entry: '₹3-6 LPA', mid: '₹10-20 LPA', senior: '₹25-50 LPA' },
      topCompanies: ['Tech Mahindra', 'Wipro', 'IBM', 'Concentrix', 'HSBC', 'Symbiosys']
    },
    hyderabad: {
      name: 'Hyderabad, India', region: 'Asia-Pacific',
      topSkills: ['Python', 'Java', 'AWS', 'DevOps', 'Data Science', 'Cyber Security', 'Cloud Computing', 'Full Stack', 'AI/ML', 'Project Management', 'Business Analysis', 'Pharma'],
      trendingSkills: ['Generative AI', 'Kubernetes', 'Terraform', 'MERN Stack', 'Blockchain', 'ESG', 'Salesforce'],
      avgSalary: { entry: '₹4-8 LPA', mid: '₹12-25 LPA', senior: '₹30-80 LPA' },
      topCompanies: ['Microsoft', 'Google', 'Amazon', 'ServiceNow', 'Salesforce', 'Deloitte', 'TCS', 'Infosys']
    },
    bengaluru: {
      name: 'Bengaluru, India', region: 'Asia-Pacific',
      topSkills: ['Java', 'Python', 'React', 'Node.js', 'AWS', 'Golang', 'System Design', 'Microservices', 'DevOps', 'Product Management', 'Agile', 'Digital Transformation'],
      trendingSkills: ['Rust', 'WebAssembly', 'Edge Computing', 'AI Agents', 'Platform Engineering', 'Climate Tech'],
      avgSalary: { entry: '₹5-10 LPA', mid: '₹15-30 LPA', senior: '₹35-90 LPA' },
      topCompanies: ['Google', 'Amazon', 'Microsoft', 'Uber', 'Flipkart', 'Swiggy', 'CRED', 'PhonePe']
    },
    mumbai: {
      name: 'Mumbai, India', region: 'Asia-Pacific',
      topSkills: ['Java', 'Python', 'SQL', 'Financial Analysis', 'Risk Management', 'React', 'Angular', 'DevOps', 'Compliance', 'Investment Banking', 'Digital Marketing', 'Supply Chain'],
      trendingSkills: ['Quantitative Analysis', 'Blockchain', 'AI in Finance', 'Cloud Migration', 'ESG Investing'],
      avgSalary: { entry: '₹4-8 LPA', mid: '₹12-28 LPA', senior: '₹30-70 LPA' },
      topCompanies: ['JP Morgan', 'Morgan Stanley', 'Tata', 'Reliance', 'Accenture', 'Capgemini']
    },
    delhi: {
      name: 'Delhi NCR, India', region: 'Asia-Pacific',
      topSkills: ['Python', 'Java', 'React', 'Node.js', 'AWS', 'Data Analytics', 'Machine Learning', 'DevOps', 'Digital Marketing', 'HR Management', 'Sales'],
      trendingSkills: ['Generative AI', 'Cybersecurity', 'Cloud Architecture', 'Product Management', 'E-commerce'],
      avgSalary: { entry: '₹4-8 LPA', mid: '₹12-28 LPA', senior: '₹30-70 LPA' },
      topCompanies: ['Zomato', 'Paytm', 'MakeMyTrip', 'Adobe', 'Microsoft', 'Accenture']
    },
    chennai: {
      name: 'Chennai, India', region: 'Asia-Pacific',
      topSkills: ['Java', 'Python', 'SQL', 'AWS', 'React', 'DevOps', 'Data Science', 'Automotive Software', 'Banking Tech'],
      trendingSkills: ['AI/ML', 'Cloud', 'FinTech', 'EV Software', 'Robotics'],
      avgSalary: { entry: '₹3-7 LPA', mid: '₹10-22 LPA', senior: '₹25-60 LPA' },
      topCompanies: ['Zoho', 'Freshworks', 'Cognizant', 'Ford', 'Renault Nissan', 'Barclays']
    },
    pune: {
      name: 'Pune, India', region: 'Asia-Pacific',
      topSkills: ['Java', 'Python', 'React', 'AWS', 'DevOps', 'Data Science', 'Automotive', 'Manufacturing IT'],
      trendingSkills: ['AI/ML', 'Cloud', 'IoT', 'Blockchain', 'ESG'],
      avgSalary: { entry: '₹4-8 LPA', mid: '₹12-24 LPA', senior: '₹28-65 LPA' },
      topCompanies: ['Infosys', 'TCS', 'Wipro', 'Mercedes-Benz', 'Volkswagen', 'John Deere']
    },

    // 🇺🇸 USA
    'san francisco': {
      name: 'San Francisco, USA', region: 'North America',
      topSkills: ['Python', 'JavaScript', 'React', 'AWS', 'Machine Learning', 'Product Management', 'Data Science', 'UI/UX Design', 'Sales', 'Marketing Analytics'],
      trendingSkills: ['Generative AI', 'Rust', 'Web3', 'Climate Tech', 'BioTech', 'Autonomous Vehicles'],
      avgSalary: { entry: '$90-130K', mid: '$150-220K', senior: '$250-500K' },
      topCompanies: ['Google', 'Apple', 'Meta', 'OpenAI', 'Stripe', 'Airbnb', 'Uber', 'Databricks']
    },
    'new york': {
      name: 'New York, USA', region: 'North America',
      topSkills: ['Python', 'Java', 'SQL', 'React', 'AWS', 'Financial Analysis', 'Risk Management', 'Product Management', 'Marketing', 'Sales'],
      trendingSkills: ['AI/ML', 'FinTech', 'Blockchain', 'ESG', 'Digital Transformation'],
      avgSalary: { entry: '$80-120K', mid: '$130-200K', senior: '$220-450K' },
      topCompanies: ['Goldman Sachs', 'JP Morgan', 'Google', 'Meta', 'Spotify', 'Peloton']
    },
    seattle: {
      name: 'Seattle, USA', region: 'North America',
      topSkills: ['Java', 'Python', 'C++', 'AWS', 'Azure', 'React', 'Data Science', 'Cloud Architecture'],
      trendingSkills: ['AI/ML', 'Quantum Computing', 'IoT', 'Sustainability Tech'],
      avgSalary: { entry: '$85-125K', mid: '$140-210K', senior: '$230-450K' },
      topCompanies: ['Amazon', 'Microsoft', 'Starbucks', 'T-Mobile', 'Zillow', 'Expedia']
    },
    austin: {
      name: 'Austin, USA', region: 'North America',
      topSkills: ['Python', 'JavaScript', 'React', 'AWS', 'DevOps', 'Data Science', 'UI/UX', 'Marketing'],
      trendingSkills: ['AI/ML', 'Cybersecurity', 'Blockchain', 'Gaming'],
      avgSalary: { entry: '$75-110K', mid: '$120-180K', senior: '$200-350K' },
      topCompanies: ['Tesla', 'Oracle', 'Dell', 'Indeed', 'Whole Foods', 'Bumble']
    },
    chicago: {
      name: 'Chicago, USA', region: 'North America',
      topSkills: ['Java', 'Python', 'SQL', 'React', 'AWS', 'Financial Analysis', 'Supply Chain', 'Healthcare IT'],
      trendingSkills: ['AI/ML', 'Cloud Migration', 'ESG', 'AgriTech'],
      avgSalary: { entry: '$70-105K', mid: '$110-170K', senior: '$180-320K' },
      topCompanies: ['Boeing', 'United Airlines', 'Walgreens', 'Caterpillar', 'McDonalds', 'Grubhub']
    },

    // More cities continue below...
    // 🇨🇦 Canada
    toronto: {
      name: 'Toronto, Canada', region: 'North America',
      topSkills: ['Python', 'Java', 'JavaScript', 'React', 'AWS', 'Data Science', 'Financial Analysis', 'DevOps', 'AI/ML'],
      trendingSkills: ['Generative AI', 'FinTech', 'Cybersecurity', 'Green Tech'],
      avgSalary: { entry: 'C$60-90K', mid: 'C$100-150K', senior: 'C$160-250K' },
      topCompanies: ['Shopify', 'RBC', 'TD Bank', 'Google', 'Microsoft', 'Wealthsimple']
    },
    vancouver: {
      name: 'Vancouver, Canada', region: 'North America',
      topSkills: ['JavaScript', 'Python', 'React', 'AWS', 'UI/UX', 'Data Science', 'Game Dev', 'Film VFX'],
      trendingSkills: ['AI/ML', 'Climate Tech', 'Blockchain', 'AR/VR'],
      avgSalary: { entry: 'C$55-85K', mid: 'C$90-140K', senior: 'C$150-230K' },
      topCompanies: ['EA Sports', 'Hootsuite', 'Slack', 'Amazon', 'Microsoft', 'Lululemon']
    },

    // 🇬🇧 UK
    london: {
      name: 'London, UK', region: 'Europe',
      topSkills: ['Python', 'Java', 'JavaScript', 'React', 'AWS', 'Financial Analysis', 'Risk Management', 'Product Management', 'Data Science'],
      trendingSkills: ['AI/ML', 'FinTech', 'Cybersecurity', 'ESG', 'Blockchain'],
      avgSalary: { entry: '£35-55K', mid: '£60-95K', senior: '£100-180K' },
      topCompanies: ['Revolut', 'Monzo', 'DeepMind', 'Barclays', 'HSBC', 'Deliveroo']
    },
    manchester: {
      name: 'Manchester, UK', region: 'Europe',
      topSkills: ['JavaScript', 'Python', 'Java', 'React', 'AWS', 'DevOps', 'Digital Marketing', 'E-commerce'],
      trendingSkills: ['AI/ML', 'Cloud', 'Cybersecurity', 'Media Tech'],
      avgSalary: { entry: '£30-45K', mid: '£50-80K', senior: '£85-140K' },
      topCompanies: ['BBC', 'Boohoo', 'AO.com', 'Booking.com', 'AutoTrader']
    },

    // 🇩🇪 Germany
    berlin: {
      name: 'Berlin, Germany', region: 'Europe',
      topSkills: ['JavaScript', 'Python', 'Java', 'React', 'AWS', 'DevOps', 'Data Science', 'UI/UX'],
      trendingSkills: ['AI/ML', 'Climate Tech', 'Blockchain', 'Mobility Tech'],
      avgSalary: { entry: '€45-60K', mid: '€65-95K', senior: '€100-150K' },
      topCompanies: ['Zalando', 'N26', 'Delivery Hero', 'SoundCloud', 'Contentful']
    },
    munich: {
      name: 'Munich, Germany', region: 'Europe',
      topSkills: ['Java', 'Python', 'C++', 'AWS', 'Azure', 'Automotive Software', 'Embedded Systems', 'Data Science'],
      trendingSkills: ['AI/ML', 'Autonomous Driving', 'IoT', 'Industry 4.0'],
      avgSalary: { entry: '€48-65K', mid: '€70-100K', senior: '€110-160K' },
      topCompanies: ['BMW', 'Siemens', 'Allianz', 'Microsoft', 'Infineon']
    },

    // 🇦🇪 Dubai
    dubai: {
      name: 'Dubai, UAE', region: 'MENA',
      topSkills: ['Java', 'Python', 'JavaScript', 'AWS', 'Cloud', 'Digital Marketing', 'Sales', 'Project Management', 'FinTech'],
      trendingSkills: ['AI', 'Blockchain', 'Smart Cities', 'ESG', 'Metaverse'],
      avgSalary: { entry: 'AED 120-240K', mid: 'AED 250-450K', senior: 'AED 500-900K' },
      topCompanies: ['Emirates', 'Careem', 'Noon', 'DP World', 'Emaar', 'Microsoft']
    },

    // 🇸🇬 Singapore
    singapore: {
      name: 'Singapore', region: 'Asia-Pacific',
      topSkills: ['Python', 'Java', 'JavaScript', 'AWS', 'Data Science', 'Financial Analysis', 'DevOps', 'Cybersecurity'],
      trendingSkills: ['AI/ML', 'FinTech', 'Blockchain', 'Quantum Computing', 'ESG'],
      avgSalary: { entry: 'S$45-70K', mid: 'S$80-130K', senior: 'S$150-250K' },
      topCompanies: ['Grab', 'Sea Group', 'DBS Bank', 'GovTech', 'ByteDance', 'Stripe']
    },

    // 🇦🇺 Australia
    sydney: {
      name: 'Sydney, Australia', region: 'Oceania',
      topSkills: ['Python', 'Java', 'JavaScript', 'React', 'AWS', 'DevOps', 'Data Science', 'Project Management'],
      trendingSkills: ['AI/ML', 'Cybersecurity', 'FinTech', 'Climate Tech'],
      avgSalary: { entry: 'A$70-100K', mid: 'A$110-160K', senior: 'A$170-280K' },
      topCompanies: ['Atlassian', 'Canva', 'Google', 'Amazon', 'Afterpay', 'Westpac']
    },
    melbourne: {
      name: 'Melbourne, Australia', region: 'Oceania',
      topSkills: ['JavaScript', 'Python', 'React', 'AWS', 'UI/UX', 'Data Science', 'Digital Marketing', 'Healthcare IT'],
      trendingSkills: ['AI/ML', 'Climate Tech', 'Blockchain', 'EdTech'],
      avgSalary: { entry: 'A$65-95K', mid: 'A$100-155K', senior: 'A$160-260K' },
      topCompanies: ['REA Group', 'Carsales', 'Telstra', 'ANZ', 'MYOB', 'Xero']
    },

    // 🇯🇵 Tokyo
    tokyo: {
      name: 'Tokyo, Japan', region: 'Asia-Pacific',
      topSkills: ['Java', 'Python', 'JavaScript', 'AWS', 'React', 'Mobile Dev', 'AI/ML', 'Data Science'],
      trendingSkills: ['AI', 'Robotics', 'IoT', 'Quantum Computing', 'Gaming'],
      avgSalary: { entry: '¥4-7M', mid: '¥8-12M', senior: '¥13-20M' },
      topCompanies: ['Rakuten', 'Line', 'Mercari', 'Sony', 'Nintendo', 'Google']
    },

    // 🇧🇷 Brazil
    'sao paulo': {
      name: 'Sao Paulo, Brazil', region: 'Latin America',
      topSkills: ['JavaScript', 'Java', 'Python', 'React', 'AWS', 'Mobile Dev', 'Data Science', 'Digital Marketing'],
      trendingSkills: ['AI', 'FinTech', 'Cloud', 'E-commerce'],
      avgSalary: { entry: 'R$50-100K', mid: 'R$120-200K', senior: 'R$250-400K' },
      topCompanies: ['Nubank', 'iFood', 'Mercado Livre', 'QuintoAndar', 'Totvs']
    },

    // 🇿🇦 South Africa
    johannesburg: {
      name: 'Johannesburg, South Africa', region: 'Africa',
      topSkills: ['Java', 'Python', 'C#', 'SQL', 'AWS', 'Azure', 'Data Science', 'DevOps', 'Business Analysis'],
      trendingSkills: ['FinTech', 'Cloud Migration', 'AI/ML', 'Cybersecurity', 'ESG'],
      avgSalary: { entry: 'R180-350K', mid: 'R500-900K', senior: 'R1.0-1.8M' },
      topCompanies: ['Standard Bank', 'Nedbank', 'Vodacom', 'MTN', 'Deloitte', 'Accenture']
    },

    // 🇳🇬 Nigeria
    lagos: {
      name: 'Lagos, Nigeria', region: 'Africa',
      topSkills: ['JavaScript', 'Python', 'Java', 'PHP', 'AWS', 'Mobile Dev', 'Data Science', 'Digital Marketing'],
      trendingSkills: ['FinTech', 'Blockchain', 'Cloud Computing', 'DevOps', 'E-commerce'],
      avgSalary: { entry: '₦2-5M', mid: '₦8-15M', senior: '₦20-40M' },
      topCompanies: ['Flutterwave', 'Paystack', 'Andela', 'Kuda', 'MTN Nigeria', 'Interswitch']
    },

    // 🇰🇪 Kenya
    nairobi: {
      name: 'Nairobi, Kenya', region: 'Africa',
      topSkills: ['Python', 'JavaScript', 'Mobile Dev', 'AWS', 'Data Science', 'Java', 'AgriTech'],
      trendingSkills: ['M-Pesa Integration', 'AgriTech', 'FinTech', 'Cloud', 'Renewable Energy'],
      avgSalary: { entry: 'KES 0.8-2M', mid: 'KES 3-6M', senior: 'KES 8-15M' },
      topCompanies: ['Safaricom', 'Cellulant', 'Twiga Foods', 'M-KOPA', 'Microsoft']
    },

    // 🇪🇬 Egypt
    cairo: {
      name: 'Cairo, Egypt', region: 'MENA',
      topSkills: ['Python', 'Java', 'PHP', 'JavaScript', 'Mobile Dev', '.NET', 'SQL', 'Digital Marketing'],
      trendingSkills: ['AI/ML', 'FinTech', 'E-commerce', 'Cybersecurity'],
      avgSalary: { entry: 'EGP 60-150K', mid: 'EGP 200-400K', senior: 'EGP 500K-1M' },
      topCompanies: ['Vodafone', 'Orange', 'Valeo', 'IBM', 'Microsoft']
    },

    // 🇫🇷 France
    paris: {
      name: 'Paris, France', region: 'Europe',
      topSkills: ['Python', 'Java', 'JavaScript', 'React', 'SQL', 'DevOps', 'Data Science', 'Marketing'],
      trendingSkills: ['AI/ML', 'Cybersecurity', 'Cloud', 'Blockchain', 'Luxury Tech'],
      avgSalary: { entry: '€35-50K', mid: '€55-80K', senior: '€90-130K' },
      topCompanies: ['Dassault', 'Capgemini', 'BNP Paribas', 'Criteo', 'Doctolib']
    },

    // 🇳🇱 Netherlands
    amsterdam: {
      name: 'Amsterdam, Netherlands', region: 'Europe',
      topSkills: ['Python', 'Java', 'JavaScript', 'AWS', 'DevOps', 'Data Engineering', 'React', 'Supply Chain'],
      trendingSkills: ['AI', 'Sustainability Tech', 'FinTech', 'Cybersecurity'],
      avgSalary: { entry: '€40-55K', mid: '€60-90K', senior: '€100-140K' },
      topCompanies: ['Booking.com', 'Adyen', 'ING', 'TomTom', 'Uber']
    },

    // 🇸🇪 Sweden
    stockholm: {
      name: 'Stockholm, Sweden', region: 'Europe',
      topSkills: ['JavaScript', 'Python', 'Java', 'React', 'AWS', 'Data Science', 'Mobile Dev', 'Design'],
      trendingSkills: ['AI', 'Green Tech', 'Gaming', 'FinTech'],
      avgSalary: { entry: 'SEK 350-500K', mid: 'SEK 550-750K', senior: 'SEK 800K-1.2M' },
      topCompanies: ['Spotify', 'Klarna', 'Ericsson', 'King', 'Volvo']
    },

    // 🇪🇸 Spain
    barcelona: {
      name: 'Barcelona, Spain', region: 'Europe',
      topSkills: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'DevOps', 'Digital Marketing'],
      trendingSkills: ['AI', 'E-commerce', 'Mobile Dev', 'Cloud', 'Travel Tech'],
      avgSalary: { entry: '€28-42K', mid: '€45-65K', senior: '€70-100K' },
      topCompanies: ['Glovo', 'Typeform', 'Wallapop', 'New Relic', 'Oracle']
    },
    madrid: {
      name: 'Madrid, Spain', region: 'Europe',
      topSkills: ['Java', 'Python', 'JavaScript', 'SQL', 'AWS', '.NET', 'Angular', 'Project Management'],
      trendingSkills: ['AI/ML', 'Cloud Migration', 'DevOps', 'Cybersecurity'],
      avgSalary: { entry: '€30-45K', mid: '€48-70K', senior: '€75-110K' },
      topCompanies: ['Santander', 'BBVA', 'Telefonica', 'Inditex', 'Amazon']
    },

    // 🇮🇹 Italy
    milan: {
      name: 'Milan, Italy', region: 'Europe',
      topSkills: ['Java', 'JavaScript', 'Python', 'SQL', 'React', 'AWS', '.NET', 'Fashion Tech'],
      trendingSkills: ['AI', 'Fashion Tech', 'FinTech', 'Cloud', 'Design'],
      avgSalary: { entry: '€28-40K', mid: '€45-65K', senior: '€70-95K' },
      topCompanies: ['Prada', 'Eni', 'UniCredit', 'Leonardo', 'Accenture']
    },

    // 🇰🇷 South Korea
    seoul: {
      name: 'Seoul, South Korea', region: 'Asia-Pacific',
      topSkills: ['Python', 'Java', 'JavaScript', 'Android', 'iOS', 'AWS', 'Data Science', 'Gaming'],
      trendingSkills: ['AI/ML', 'Blockchain', 'Cloud', 'Metaverse'],
      avgSalary: { entry: '₩35-55M', mid: '₩60-90M', senior: '₩100-150M' },
      topCompanies: ['Samsung', 'LG', 'Naver', 'Kakao', 'Coupang']
    },

    // 🇨🇳 China
    shanghai: {
      name: 'Shanghai, China', region: 'Asia-Pacific',
      topSkills: ['Java', 'Python', 'JavaScript', 'AI/ML', 'Big Data', 'Cloud Computing', 'Mobile Dev'],
      trendingSkills: ['AI', 'Autonomous Driving', '5G', 'Quantum Computing'],
      avgSalary: { entry: '¥120-250K', mid: '¥300-500K', senior: '¥600K-1M' },
      topCompanies: ['Alibaba', 'Tencent', 'ByteDance', 'Pinduoduo', 'Huawei']
    },

    // 🇭🇰 Hong Kong
    'hong kong': {
      name: 'Hong Kong', region: 'Asia-Pacific',
      topSkills: ['Java', 'Python', 'JavaScript', 'SQL', 'AWS', 'React', 'Node.js', 'Financial Analysis'],
      trendingSkills: ['FinTech', 'AI/ML', 'Blockchain', 'Cloud', 'ESG'],
      avgSalary: { entry: 'HK$200-400K', mid: 'HK$500-800K', senior: 'HK$900K-1.5M' },
      topCompanies: ['HSBC', 'Standard Chartered', 'CLP', 'PCCW', 'IBM']
    },

    // 🇲🇾 Malaysia
    'kuala lumpur': {
      name: 'Kuala Lumpur, Malaysia', region: 'Asia-Pacific',
      topSkills: ['Java', 'Python', 'JavaScript', 'SQL', 'AWS', 'React', 'Mobile Dev', 'Data Analytics'],
      trendingSkills: ['AI', 'Cybersecurity', 'Cloud', 'Data Analytics', 'Islamic FinTech'],
      avgSalary: { entry: 'RM 36-60K', mid: 'RM 72-120K', senior: 'RM 150-250K' },
      topCompanies: ['Petronas', 'AirAsia', 'Grab', 'CIMB', 'Maybank']
    },

    // 🇵🇭 Philippines
    manila: {
      name: 'Manila, Philippines', region: 'Asia-Pacific',
      topSkills: ['JavaScript', 'Python', 'Java', 'PHP', 'React', 'AWS', '.NET', 'Customer Service'],
      trendingSkills: ['AI', 'Cloud Computing', 'Cybersecurity', 'Blockchain', 'BPO Tech'],
      avgSalary: { entry: 'PHP 300-600K', mid: 'PHP 700K-1.2M', senior: 'PHP 1.5-2.5M' },
      topCompanies: ['Accenture', 'IBM', 'Google', 'Microsoft', 'Oracle']
    },

    // 🇹🇷 Turkey
    istanbul: {
      name: 'Istanbul, Turkey', region: 'MENA',
      topSkills: ['Java', 'Python', 'JavaScript', 'React', 'AWS', 'Mobile Dev', 'SQL', 'Digital Marketing'],
      trendingSkills: ['AI', 'FinTech', 'Gaming', 'E-commerce', 'Defense Tech'],
      avgSalary: { entry: 'TRY 150-350K', mid: 'TRY 400-700K', senior: 'TRY 800K-1.5M' },
      topCompanies: ['Trendyol', 'Getir', 'Peak Games', 'Hepsiburada', 'Turkcell']
    },

    // 🇸🇦 Saudi Arabia
    riyadh: {
      name: 'Riyadh, Saudi Arabia', region: 'MENA',
      topSkills: ['Java', 'Python', 'JavaScript', 'AWS', 'Cybersecurity', 'Data Science', 'Cloud', 'Project Management'],
      trendingSkills: ['AI', 'FinTech', 'Smart Cities', 'IoT', 'Renewable Energy'],
      avgSalary: { entry: 'SAR 80-180K', mid: 'SAR 200-350K', senior: 'SAR 400-700K' },
      topCompanies: ['Aramco', 'STC', 'SABIC', 'Al Rajhi Bank', 'NEOM']
    },

    // 🇶🇦 Qatar
    doha: {
      name: 'Doha, Qatar', region: 'MENA',
      topSkills: ['Java', 'Python', 'AWS', 'Cybersecurity', 'Data Science', 'Cloud', 'Project Management'],
      trendingSkills: ['AI', 'Smart Cities', 'FinTech', 'IoT', 'Sports Tech'],
      avgSalary: { entry: 'QAR 80-180K', mid: 'QAR 200-350K', senior: 'QAR 400-700K' },
      topCompanies: ['QatarEnergy', 'Ooredoo', 'QNB', 'Qatar Airways', 'Microsoft']
    },

    // 🇵🇰 Pakistan
    karachi: {
      name: 'Karachi, Pakistan', region: 'Asia-Pacific',
      topSkills: ['JavaScript', 'Python', 'PHP', 'Java', 'React', 'Laravel', 'AWS', 'Digital Marketing'],
      trendingSkills: ['AI', 'Blockchain', 'FinTech', 'Cloud', 'E-commerce'],
      avgSalary: { entry: 'PKR 0.6-1.5M', mid: 'PKR 2-4M', senior: 'PKR 5-10M' },
      topCompanies: ['10Pearls', 'Systems Limited', 'Afiniti', 'Contour', 'IBM']
    },
    lahore: {
      name: 'Lahore, Pakistan', region: 'Asia-Pacific',
      topSkills: ['JavaScript', 'Python', 'PHP', 'React', 'Laravel', 'Node.js', 'AWS', 'UI/UX'],
      trendingSkills: ['AI', 'Cloud', 'Mobile Dev', 'FinTech', 'Gaming'],
      avgSalary: { entry: 'PKR 0.5-1.2M', mid: 'PKR 1.8-3.5M', senior: 'PKR 4-8M' },
      topCompanies: ['Arbisoft', 'Techlogix', 'Confiz', 'SAP', 'Netsol']
    },

    // 🇧🇩 Bangladesh
    dhaka: {
      name: 'Dhaka, Bangladesh', region: 'Asia-Pacific',
      topSkills: ['JavaScript', 'Python', 'PHP', 'Java', 'React', 'Node.js', 'AWS', 'Mobile Dev'],
      trendingSkills: ['AI', 'Cloud', 'Mobile Dev', 'E-commerce', 'FinTech'],
      avgSalary: { entry: 'BDT 300-700K', mid: 'BDT 800K-1.5M', senior: 'BDT 2-4M' },
      topCompanies: ['Pathao', 'bKash', 'Shohoz', 'Grameenphone', 'Samsung R&D']
    },

    // 🇲🇽 Mexico
    'mexico city': {
      name: 'Mexico City, Mexico', region: 'Latin America',
      topSkills: ['JavaScript', 'Java', 'Python', 'React', 'AWS', '.NET', 'SQL', 'Digital Marketing'],
      trendingSkills: ['AI', 'FinTech', 'Cloud', 'E-commerce'],
      avgSalary: { entry: 'MXN 200-400K', mid: 'MXN 500-800K', senior: 'MXN 1.0-1.8M' },
      topCompanies: ['Softtek', 'Kueski', 'Clip', 'Mercado Libre', 'Oracle']
    },

    // 🇦🇷 Argentina
    'buenos aires': {
      name: 'Buenos Aires, Argentina', region: 'Latin America',
      topSkills: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'Mobile Dev'],
      trendingSkills: ['AI', 'Blockchain', 'FinTech', 'Cloud'],
      avgSalary: { entry: 'ARS 3-8M', mid: 'ARS 10-18M', senior: 'ARS 22-40M' },
      topCompanies: ['Mercado Libre', 'Globant', 'Despegar', 'Uala', 'Accenture']
    },

    // 🇵🇱 Poland
    warsaw: {
      name: 'Warsaw, Poland', region: 'Europe',
      topSkills: ['Java', 'Python', 'JavaScript', 'React', 'AWS', '.NET', 'SQL', 'Data Science'],
      trendingSkills: ['AI', 'Cloud', 'Cybersecurity', 'Blockchain'],
      avgSalary: { entry: 'PLN 80-150K', mid: 'PLN 180-280K', senior: 'PLN 300-500K' },
      topCompanies: ['CD Projekt Red', 'Allegro', 'ING Tech', 'Google', 'Microsoft']
    },

    // 🇨🇭 Switzerland
    zurich: {
      name: 'Zurich, Switzerland', region: 'Europe',
      topSkills: ['Java', 'Python', 'JavaScript', 'SQL', 'AWS', 'DevOps', 'Data Science', 'Banking Tech'],
      trendingSkills: ['AI/ML', 'FinTech', 'Blockchain', 'Cybersecurity'],
      avgSalary: { entry: 'CHF 85-120K', mid: 'CHF 130-180K', senior: 'CHF 190-280K' },
      topCompanies: ['Google', 'UBS', 'Credit Suisse', 'ETH Zurich', 'Swisscom']
    },

    // 🇮🇪 Ireland
    dublin: {
      name: 'Dublin, Ireland', region: 'Europe',
      topSkills: ['Python', 'Java', 'JavaScript', 'AWS', 'React', 'Data Science', 'DevOps', 'Project Management'],
      trendingSkills: ['AI', 'Cybersecurity', 'Cloud', 'FinTech'],
      avgSalary: { entry: '€40-55K', mid: '€60-90K', senior: '€100-140K' },
      topCompanies: ['Google', 'Facebook', 'Stripe', 'LinkedIn', 'Workday']
    }
  },

  detect: function(resumeData) {
    var location = (resumeData?.personal?.location || '').toLowerCase().trim();

    // Direct city match
    for (var city in this.cities) {
      if (location.includes(city)) return this.cities[city];
    }

    // Country-level match
    var countryMap = {
      'india': ['hyderabad','bengaluru','mumbai','delhi','chennai','pune','visakhapatnam'],
      'usa': ['san francisco','new york','seattle','austin','chicago'],
      'united states': ['san francisco','new york','seattle','austin','chicago'],
      'canada': ['toronto','vancouver'],
      'uk': ['london','manchester'],
      'united kingdom': ['london','manchester'],
      'germany': ['berlin','munich'],
      'uae': ['dubai'],
      'singapore': ['singapore'],
      'australia': ['sydney','melbourne'],
      'japan': ['tokyo'],
      'brazil': ['sao paulo'],
      'south africa': ['johannesburg'],
      'nigeria': ['lagos'],
      'kenya': ['nairobi'],
      'egypt': ['cairo'],
      'france': ['paris'],
      'netherlands': ['amsterdam'],
      'sweden': ['stockholm'],
      'spain': ['barcelona','madrid'],
      'italy': ['milan'],
      'south korea': ['seoul'],
      'china': ['shanghai'],
      'hong kong': ['hong kong'],
      'malaysia': ['kuala lumpur'],
      'philippines': ['manila'],
      'turkey': ['istanbul'],
      'saudi arabia': ['riyadh'],
      'qatar': ['doha'],
      'pakistan': ['karachi','lahore'],
      'bangladesh': ['dhaka'],
      'mexico': ['mexico city'],
      'argentina': ['buenos aires'],
      'poland': ['warsaw'],
      'switzerland': ['zurich'],
      'ireland': ['dublin']
    };

    for (var country in countryMap) {
      if (location.includes(country)) {
        var cities = countryMap[country];
        return this.cities[cities[0]];
      }
    }

    return this.cities['san francisco'];
  },

  analyze: function(resumeData) {
    var city = this.detect(resumeData);
    var userSkills = (resumeData?.skills || []).map(function(s){ return s.toLowerCase(); });
    var missingSkills = city.topSkills.filter(function(s){ return !userSkills.includes(s.toLowerCase()); });
    var missingTrending = city.trendingSkills.filter(function(s){ return !userSkills.includes(s.toLowerCase()); });

    return {
      city: city,
      present: city.topSkills.filter(function(s){ return userSkills.includes(s.toLowerCase()); }),
      missing: missingSkills.slice(0, 5),
      trending: missingTrending.slice(0, 3),
      avgSalary: city.avgSalary,
      topCompanies: city.topCompanies
    };
  }
};

function showLocalSkills() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }

  var analysis = LocalSkills.analyze(App.resumeData);

  var existing = document.getElementById('local-skills-modal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'local-skills-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:520px;width:90%;max-height:85vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">📍 '+analysis.city.name+' Market Insights</h2><button onclick="document.getElementById(\'local-skills-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div>'+
    '<div style="margin-bottom:4px;font-size:0.75rem;color:#6b7280;">Region: '+analysis.city.region+'</div>'+
    '<div style="margin-bottom:12px;"><h3 style="font-weight:600;font-size:0.9rem;margin-bottom:6px;">💰 Salary Ranges:</h3><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:0.75rem;"><div style="background:#f0fdf4;padding:8px;border-radius:6px;text-align:center;"><div style="font-weight:600;color:#166534;">Entry</div>'+analysis.avgSalary.entry+'</div><div style="background:#eff6ff;padding:8px;border-radius:6px;text-align:center;"><div style="font-weight:600;color:#1e40af;">Mid</div>'+analysis.avgSalary.mid+'</div><div style="background:#fef3c7;padding:8px;border-radius:6px;text-align:center;"><div style="font-weight:600;color:#92400e;">Senior</div>'+analysis.avgSalary.senior+'</div></div></div>'+
    '<div style="margin-bottom:12px;"><h3 style="font-weight:600;font-size:0.9rem;margin-bottom:4px;">✅ Skills You Have:</h3><div class="flex flex-wrap gap-1">'+analysis.present.map(function(s){ return '<span style="background:#d1fae5;color:#065f46;padding:2px 8px;border-radius:10px;font-size:0.75rem;">'+s+'</span>'; }).join('')+'</div></div>'+
    '<div style="margin-bottom:12px;"><h3 style="font-weight:600;font-size:0.9rem;margin-bottom:4px;">📖 Skills to Add:</h3><div class="flex flex-wrap gap-1">'+analysis.missing.map(function(s){ return '<span style="background:#fee2e2;color:#991b1b;padding:2px 8px;border-radius:10px;font-size:0.75rem;">'+s+'</span>'; }).join('')+'</div></div>'+
    '<div style="margin-bottom:12px;"><h3 style="font-weight:600;font-size:0.9rem;margin-bottom:4px;">🔥 Trending in '+analysis.city.name+':</h3><div class="flex flex-wrap gap-1">'+analysis.trending.map(function(s){ return '<span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:10px;font-size:0.75rem;">'+s+'</span>'; }).join('')+'</div></div>'+
    '<div><h3 style="font-weight:600;font-size:0.9rem;margin-bottom:4px;">🏢 Top Employers:</h3><p style="font-size:0.8rem;color:#4b5563;">'+analysis.topCompanies.join(' • ')+'</p></div></div>';
  document.body.appendChild(modal);
}