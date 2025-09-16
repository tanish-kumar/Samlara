// ====== Imports ======
const express = require("express");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const cors = require("cors");

// ====== Setup ======
dotenv.config();
const app = express();

// ====== MongoDB Connection ======
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ====== Models ======
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

// ====== Middlewares ======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "samlara_secret_single",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" },
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// ====== Seed Products ======
const SEED_MODE = true; // ✅ Development ke liye true rakho, Production me false

(async () => {
  try {
    const items = [
      {
        name: "“Trust Issues” tee",
        price: 529,
        image: "/assets/DSC00152.jpg",
        images:"/assets/DSC00160.jpg",
        tag: "NEW",
        sizes: ["S", "M", "L", "XL"],
        desc: "“Trust Issues” tee: edgy graphic text, maybe distressed look, strong message, casual fit. Perfect for street style. Fabric 100% cotton, slightly heavier, print quality high (screen print or rubber ink), well stitched.",
        rw1_name: "Bunty",
        rw1: "Message thoda bold hai, design unique hai. Shirt thick hai suru me thoda stiff tha lekin wash ke baad soft hogaya.",
        rw2_name: "Kanish",
        rw2: "Print edges clean hai, cracking nahi hua. Colours bold hain.",
        rw3_name: "Raman",
        rw3: "Neck line sag nahi kar rahi, shirt shape maintain kar rahi hai wash ke baad. Very impressive and worthy.",
      },
      {
        name: "“Error” tee",
        price: 479,
        image: "/assets/DSC00170.jpg",
        images:"/assets/DSC00166.jpg",
        tag: "LIMITED",
        sizes:["S", "M", "L", "XL"],
        desc: "futuristic / glitch type design, maybe print broken letters, tech aesthetic. Regular or slightly loose fit. Fabric 100% cotton; tight knit; ensures shape retention; print high quality.",
        rw1_name: "Krish",
        rw1: "Design bohot hatke hai, log puch rahe hain ye kahan se hai. Cotton high grade lag raha hai.",
        rw2_name: "Ranveer Fitness",
        rw2: "Error print ka glitch details perfect hai, fade nahi ho rahi. Wash care instructions follow karne par safe hai.",
        rw3_name: "Kushal",
        rw3: "Fit thoda roomy hai jo mujhe pasand hai. Comfort aur style dono mil gaya.",
      },
      {
        name: "“Good Times” T shirt",
        price: 487,
        image: "/assets/DSC00203.jpg",
        images:"/assets/DSC00196.jpg",
        tag: "OFFER",
        sizes:["S", "M", "L", "XL"],
        desc: "bright/vintage vibe, cheerful text “GOOD TIMES” with maybe pastel colors or retro font, regular relaxed fit. Fabric 100% cotton, soft washed finish for vintage feeling, breathable, comfortable around arms.",
        rw1_name: "Avni",
        rw1: "I ordered this good times printed t shirt for my husband and I personally recommended this to everyone what a superb quality of tee and very comfortable to wear.",
        rw2_name: "Karan",
        rw2: "Quality zabardast h aur price ke hisaab se worth h. Bas thoda aur thick fabric hota to aur bhi better lagta.",
        rw3_name: "Aman",
        rw3: "Casual outing ke liye ekdum best h. Size bilkul sahi tha aur material premium lagta h. Dost logon ne bhi poocha kahan se li h!",
      },
      {
        name: "Off White Stretch tee",
        price: 529,
        image: "/assets/DSC00223.jpg",
        images:"/assets/DSC00226.jpg",
        sizes:["S", "M", "L", "XL"],
        desc: "stretchable flap around arms/torso for extra comfort; design maybe minimal, logo textured or rubberized.Fabric100% cotton with stretch weave. Soft and slightly body hugging.",
        rw1_name: "Royal Biswa",
        rw1: "Pehle stretch wala cotton try kar liya, comfortable hai. Movement restrictions nahi.",
        rw2_name: "Naveen Kumar",
        rw2: "Fabric soft hai, colour wash ke baad bhi fade nahi hua. Bahut satisfied.",
        rw3_name: "Vikas",
        rw3: "Bhai is T-shirt ne to dil jeet liya. Fit ekdum sahi, print stylish aur look bhi premium. Ab to aur colors me order karunga.",
      },
      {
        name: "“Karma” graphic tee",
        price: 479,
        image: "/assets/DSC00246.jpg",
        images:"/assets/DSC00249.jpg",
        tag: "NEW",
        sizes: ["S", "M", "L", "XL"],
        desc: "minimalist or elegant design, “KARMA” text maybe stylized, monochrome or subtle tones, regular fit.Fabric 100% cotton; medium weight; breathable; nice finish.",
        rw1_name: "Anshu Jatwa",
        rw1: "T shirt quality shandar hai, cotton soft hai. Message ka font classy hai.",
        rw2_name: "Shashikant",
        rw2: "Multiple washes ke baad bhi shrinkage minimal hai, fit loss nahi hua.",
        rw3_name: "Saurabh",
        rw3: "Seriously bhai, ye t-shirt pehne ke baad confidence level hi alag lagta h. Material soft h aur summer friendly h.",
      },
      {
        name: "“Focus” graphic cotton tee",
        price: 519,
        image: "/assets/FOCUS15164.jpg",
        images:"/assets/FOCUS15163.jpg",
        sizes: ["S", "M", "L", "XL"],
        desc: "Minimalist design with “FOCUS” wording in large bold font, maybe small logo on sleeve or back. Regular fit, crew neck, short sleeves. Ideal for pairing with casual trousers or overshirt. Fabric 100% ringspun cotton; medium weight (≈180 200 gsm), breathable & shrinks.",
        rw1_name: "Tanish Kumar",
        rw1: "Yeh shirt pehna aur poore din comfort mila, cotton bilkul skin friendly hai. Colour wash ke baad bhi same hai.",
        rw2_name: "Noddy",
        rw2: "Washes well, no color fading so far. Very impressed.",
        rw3_name: "Kapil",
        rw3: "Fit bilkul as shown photo me. Fabric thoda thick hai, quality dikh rahi hai.",
      },
      {
        name: "“Dog” print T shirt",
        price: 529,
        image: "/assets/DOG265294.jpg",
        images:"/assets/DOG265293.jpg",
        tag: "LIMITED",
        sizes: ["S", "M", "L", "XL"],
        desc: "playful graphic of dog (maybe cartoon or silhouette) with stylized text. Casual relaxed cut, possibly drop shoulder style. Fabric 100% cotton, soft jersey knit, breathable, good stitching around neck & sleeves.",
        rw1_name: "Atul Pandey",
        rw1: "Perfect summer tee. Light, airy, and doesn’t stick to skin.",
        rw2_name: "Neeraj",
        rw2: "Sleeve length aur shirt length perfect hai. Pair karo shorts ya jeans dono ke saath jaata hai",
        rw3_name: "Mayank Sharma",
        rw3: "Kafi washes kar diye hain, colour fade nahi, neck shape kharaab nahi hua.",
      },
      {
        name: "“Backbone” tee",
        price: 499,
        image: "/assets/bone845121.jpg",
        images:"/assets/bone845122.jpg",
        sizes: ["S", "M", "L", "XL"],
        desc: "strong typography, maybe bold spine like graphic down back, strong prints, regular or loose fit. Fabric 100% cotton, substantial weight, rugged feel, double stitching at hem/sleeves.",
        rw1_name: "",
        rw1: "Back print ekdum strong hai, print peel nahi hua wash ke baad bhi.",
        rw2_name: "",
        rw2: "Shirt ka feel weighty hai, badiya for winters ya layering. Bahar pehenne mein ache dikh rahi hai.",
        rw3_name: "",
        rw3: "Neck tight banda hai. Stitching edges pe loose thread nahi hai.",
      },
      {
        name: "Off White “Believe” T shirt",
        price: 498,
        image: "/assets/OFF WHITE Biliv6545.jpg",
        images:"/assets/DSC00160.jpg",
        tag: "NEW",
        sizes: ["S", "M", "L", "XL"],
        desc: "Classic crew neck cut, relaxed fit, off white base colour with bold “BELIEVE” typography print across chest. Sleeve ribbing, double stitched hem. Casual everyday streetwear style. Fabric 100% heavy weight combed cotton; soft inner side, breathable but substantial, non see through.",
        rw1_name: "Puneet Sharma",
        rw1: "Material ka feel bohot premium hai, cotton bilkul soft hai. Print bhi clean hai, wash ke baad bhi fade nahi hua.",
        rw2_name: "Akash Dhiman",
        rw2: "Fit perfect hai — size L liya tha, thoda loose ho gaya jaisa chahiye tha. Pairing with jeans full casual look ban gaya.",
        rw3_name: "Aniket",
        rw3: "Durability achhi hai — 3 4 washes ke baad bhi stitching tight hai, colour bleed nahi hua. Recommend karta hoon.",
      },
    ];

    if (SEED_MODE) {
      await Product.deleteMany(); // 🧹 Purane delete
      await Product.insertMany(items); // ♻️ Naye insert
      console.log("🟢 Products refreshed:", items.length);
    } else {
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany(items);
        console.log("🟢 Products seeded:", items.length);
      }
    }
  } catch (err) {
    console.error("❌ Product seeding failed:", err);
  }
})();

// ====== Middleware: Check Login ======
const requireLogin = async (req, res, next) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Login required" });
  next();
};

// ====== AUTH Routes ======
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    req.session.userId = user._id.toString();
    res.json({
      message: "Registered",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    req.session.userId = user._id.toString();
    res.json({
      message: "Logged in",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

app.get("/api/auth/me", async (req, res) => {
  try {
    if (!req.session.userId) return res.json({ user: null });
    const user = await User.findById(req.session.userId).select("name email");
    res.json({ user });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// ====== PRODUCT Routes ======
app.get("/api/products", async (req, res) => {
  const items = await Product.find().sort({ createdAt: -1 });
  res.json(items);
});

app.get("/api/products/:id", async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
});

// ====== CART Routes ======
app.get("/api/cart/mine", requireLogin, async (req, res) => {
  const user = await User.findById(req.session.userId).populate("cart.product");
  res.json(user.cart || []);
});

app.post("/api/cart/add", requireLogin, async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.session.userId);

  const idx = user.cart.findIndex((c) => c.product.toString() === productId);
  if (idx > -1) user.cart[idx].quantity += 1;
  else user.cart.push({ product: productId, quantity: 1 });

  await user.save();
  res.json({ message: "Added to cart" });
});

app.post("/api/cart/remove", requireLogin, async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.session.userId);
  user.cart = user.cart.filter((c) => c.product.toString() !== productId);
  await user.save();
  res.json({ message: "Removed from cart" });
});

app.post("/api/cart/update", requireLogin, async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.session.userId);
  const item = user.cart.find((c) => c.product.toString() === productId);
  if (!item) return res.status(404).json({ message: "Not in cart" });
  item.quantity = quantity;
  await user.save();
  res.json({ message: "Quantity updated" });
});

// ====== WISHLIST Routes ======
app.get("/api/wishlist/mine", requireLogin, async (req, res) => {
  const user = await User.findById(req.session.userId).populate("wishlist");
  res.json(user.wishlist || []);
});

app.post("/api/wishlist/add", requireLogin, async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.session.userId);
  if (!user.wishlist.find((id) => id.toString() === productId)) {
    user.wishlist.push(productId);
    await user.save();
  }
  res.json({ message: "Added to wishlist" });
});

app.post("/api/wishlist/remove", requireLogin, async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.session.userId);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  await user.save();
  res.json({ message: "Removed from wishlist" });
});

// ====== ORDER Routes ======
app.post("/api/orders/create", requireLogin, async (req, res) => {
  try {
    const { productId, size, address, paymentMethod } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!size || !product.sizes.includes(size))
      return res.status(400).json({ message: "Invalid size" });
    if (!["COD", "QR"].includes(paymentMethod))
      return res.status(400).json({ message: "Invalid payment" });

    const user = await User.findById(req.session.userId);

    const order = await Order.create({
      user: user._id,
      product: product._id,
      size,
      price: product.price,
      address,
      paymentMethod,
      status: "PLACED",
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("product", "name image price");

    // 🔑 Transporter for custom domain email
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",  // ya cPanel me jo diya ho
      port: 465,                   // 465 SSL (true) ya 587 (false)
      secure: true,
      auth: {
        user: "shopping@samlara.in",
        pass: "Fashionsamlara@16sept", // apne email ka password
      },
    });

    // 🔔 Send order confirmation
    await transporter.sendMail({
      from: '"SamLara Shop 👕" <shopping@samlara.in>',
      to: [user.email, "shopping@samlara.in"].join(","),
      subject: "SamLara Order Confirmation",
      text: `✅ Order placed!\n\nProduct: ${product.name}\nSize: ${size}\nPrice: ₹${product.price}\nPayment: ${paymentMethod}\n\nShip To:\n${address.fullName}\n${address.phone}\n${address.line1}\n${address.line2 || ""}\n${address.city}, ${address.state} - ${address.pincode}`,
    });

    res.json({ message: "Order placed", order: populatedOrder });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/orders/mine", requireLogin, async (req, res) => {
  try {
    console.log("🟢 Orders API hit, session user:", req.session.userId);

    const list = await Order.find({ user: req.session.userId })
      .sort({ createdAt: -1 })
      .populate("product", "name image price");

    console.log("🟢 Orders found:", list);
    res.json(list);
  } catch (e) {
    console.error("❌ Orders fetch error:", e);
    res.status(500).json({ message: "Server error" });
  }
});



// ====== CONTACT FORM ======
app.post("/send-email", async (req, res) => {
  console.log("📩 Contact form received:", req.body);
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ error: "Please fill all required fields" });

    // 🔑 Same transporter for contact form
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: "shopping@samlara.in",
        pass: "Fashionsamlara@16sept",
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "shopping@samlara.in",
      subject: `New Contact Form: ${subject || "No Subject"}`,
      text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nSubject: ${subject || "N/A"}\nMessage: ${message}`,
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});


// ====== Health Check ======
app.get("/health", (req, res) => res.json({ status: "SamLara fullshop up" }));

// ====== Start Server ======
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
