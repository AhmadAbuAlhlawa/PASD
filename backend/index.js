const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Admin = require('./models/Admin');
const models = require('./models/Data');
const morgan = require('morgan');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const {
    Status_Model,
    Usage_Model,
    Countries_Model,
    Cities_Model,
    Addresses_Model,
    bdr_Model,
    Buildings_Model,
    Architects_Model,
    Buildings_Architects_Model,
    Notaries_Model,
    Buildings_Notaries_Model,
    Owners_Model,
    Buildings_Owners_Model,
    Tenants_Model,
    Buildings_Tenants_Model,
    Buildings_Usage_Model,
    Buildings_Status_Model,
    Images_Model

} = models;

const {
  AdminModel,
  Log
} = Admin;
 

require('dotenv').config();

const app = express();
 
// Middleware with increased limit
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME,
})
  .then(() => console.log('Connected to PASD database'))
  .catch(err => console.error('MongoDB connection error:', err));

let gfs, bucket;


const conn = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.post('/logs', async (req, res) => {
  const { action, details, timestamp, adminUsername } = req.body;
  

  try {
      const detailsString = typeof details === 'object' ? JSON.stringify(details) : details;

        // Create a new log entry
        const newLog = new Log({
            action,
            details: detailsString,
            timestamp,
            adminUsername
        });

        // Save the log to the database
        await newLog.save();

        res.status(201).send({ message: 'Log saved' });
    } catch (error) {
        console.error("Error saving log:", error);
        res.status(500).send({ message: 'Error saving log' });
    }
});

app.get('/logs/:adminUsername', async (req, res) => {
    try {
        const logs = await Log.find({ adminUsername: req.params.adminUsername });
        res.status(200).json(logs); // Send logs for the selected admin
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).send({ message: 'Error fetching logs' });
    }
});


app.delete('/deleteAdmin/:adminId', async (req, res) => {
  try {
    const admin = await AdminModel.findByIdAndDelete(req.params.adminId);

    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' });
    }

    res.status(200).send({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).send({ message: 'Error deleting admin' });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Initialize GridFS and bucket
conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads',
    });
    bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
});

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload endpoint
app.post("/add-images", upload.single("file"), async (req, res) => {
  try {
    // Validate the file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Parse form data
    const { building_id, description, Type, referenceType, pictureReference } = req.body;

    // Validate required fields
    if (!building_id || !Type) {
      return res.status(400).json({ error: "Building ID, and Type are required" });
    }

    // Create a writable stream to GridFS
    const stream = gfs.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    // Upload the file buffer to the stream
    stream.end(req.file.buffer);

    // Handle stream events
    stream.on("finish", async () => {
      try {
        // Save file metadata and additional details in the images collection
        const imageDoc = await conn.db.collection("images").insertOne({
          fileId: stream.id,
          building_id,
          description,
          Type, // Combined type and number (e.g., "Floor 2")
          referenceType, // "ownedByPASD" or "pictureReference"
          pictureReference: referenceType === "pictureReference" ? pictureReference : null, // Only include if referenceType is "pictureReference"
          filename: req.file.originalname,
        });

        res.status(200).json({
          message: "File uploaded successfully",
          file: {
            id: stream.id,
            building_id,
            description,
            Type,
            referenceType,
            pictureReference: referenceType === "pictureReference" ? pictureReference : null,
          },
        });
      } catch (error) {
        console.error("Error saving file metadata:", error);
        res.status(500).json({ error: "Failed to save image metadata" });
      }
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).json({ error: "File upload failed" });
    });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve image by filename
app.get('/files/:filename', (req, res) => {
    gfs.openDownloadStreamByName(req.params.filename)
    .pipe(res)
    .on('error', (err) => {
        console.error(err);
        res.status(404).json({ error: 'File not found' });
    });
});

// Your route using the upload middleware
/*app.post("/cities/:id/upload-map", upload.single("map"), async (req, res) => {
  const cityId = req.params.id;
  console.log("Received cityId:", cityId);

  try {
    const city = await Cities_Model.findById(cityId);
    console.log("City found:", city);

    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }

    city.map = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await city.save();
    res.status(200).json({ message: "Map uploaded successfully" });
  } catch (error) {
    console.error("Error uploading map:", error);
    res.status(500).json({ error: "Failed to upload map" });
  }
});

// Get all PDFs route
app.get("/pdfs", async (req, res) => {
  try {
    const pdfs = await PDF.find({}, "name");
    res.status(200).json(pdfs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch PDFs" });
  }
});

*/


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    AdminModel.findOne({ username: username })
        .then(admin => {
            if (admin) {
                if (admin.password === password) {
                res.json("Success")
            } else {
                res.json("username or password incorrect")
            }
            } else {
                res.json("username does not exist")
            }
    })
})

app.post('/addAdmin', async (req, res) => {
    try {
        const { first_name, last_name ,email, username, password} = req.body;

        // Check if an admin with the same username already exists
        const existingAdminusername = await AdminModel.findOne({ username });
        // Check if an admin with the same email already exists
        const existingAdminemail = await AdminModel.findOne({ email });

        // If either username or email already exists, send an error response
        if (existingAdminusername) {
            return res.status(409).json({ message: "Admin with this username already exists." });
        } else if (existingAdminemail) {
            return res.status(409).json({ message: "Admin with this email already exists." });
        }

        // Create and save the new admin (you might want to hash the password here)
        const newAdmin = await AdminModel.create({ first_name, last_name, email, username, password });

        // Return the success response
        res.status(201).json({ message: "Admin created successfully", admins: newAdmin });

    } catch (error) {
        // Catch any other errors that may occur during admin creation
        console.error("Error creating admin:", error);
        return res.status(500).json({ message: "Error creating admin", error });
    }
});




app.get('/admin/:username', (req, res) => {
    const { username } = req.params;
    AdminModel.findOne({ username })
        .then(admin => {
            if (admin) res.json(admin);
            else res.status(404).json({ message: "Admin not found" });
        })
        .catch(err => res.status(500).json(err));
});


app.put('/admin/:username', (req, res) => {
    const { username } = req.params;
    const updates = req.body;
    AdminModel.findOneAndUpdate({ username }, updates, { new: true })
        .then(updatedAdmin => res.json(updatedAdmin))
        .catch(err => res.status(500).json(err));
});

// fetch all admins
app.get('/getAdmins', async (req, res) => {
    try {
        const admins = await AdminModel.find(); // Fetch all admins
        res.status(200).json(admins); // Respond with admins in JSON format
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admins', error });
    }
});
// Fetch Buildings
app.get('/buildings', async (req, res) => {
  try {
    const buildings = await Buildings_Model.find(); // Fetch all Building
    res.status(200).json(buildings); // Respond with admins in JSON format
  } catch (error) {
    console.error("Error fetching buildings:", error); // Debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// fetch building depend on city
app.get('/buildings/:city_id', async (req, res) => {
    const { city_id } = req.params;
    try {
        
        // Find all addresses with the given city_id
        const addresses = await Addresses_Model.find({ city_id: city_id });
        const addressIds = addresses.map(address => address._id);
        
        const buildings = await Buildings_Model.find({ address_id: { $in: addressIds } }).populate({ path: 'address_id' });
        res.status(200).json(buildings);
    } catch (error) {
        console.error("Error fetching buildings for city:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// general search
  app.get('/search', async (req, res) => {
    try {
      // users
      const {q} = req.query
      if(!q || q.length < 1) res.send({ message: "Please enter a search query." });

        // Find all addresses, buildings, and cities that match the search query
        const buildings = await Buildings_Model.find({ building_name: { $regex: new RegExp(q.trim(), "i") }}).limit(10).select('building_name');
        const cities = await Cities_Model.find({ city_name: { $regex: new RegExp(q.trim(), "i") }}).limit(10).select('city_name');
        const archeticts = await Architects_Model.find({ architect_name: { $regex: new RegExp(q.trim(), "i") }}).limit(10).select('architect_name');
        // Combine all results into a single array
        let results = [];
        for(let i = 0; i < buildings.length; i++) {
          results.push({ 
            type: "building",
            _id: buildings[i]._id,
            title: buildings[i].building_name,
           });
        }
        for(let i = 0; i < cities.length; i++) {
          results.push({ 
            type: "city",
            _id: cities[i]._id,
            title: cities[i].city_name,
           });
        }
        for(let i = 0; i < archeticts.length; i++) {
          results.push({ 
            type: "architect",
            _id: archeticts[i]._id,
            title: archeticts[i].architect_name,
           });
        }
      // sort data (games and users) by title
      results.sort((a, b) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();
      
        if (titleA > titleB) {
          return 1; // Change the order here
        }
        if (titleA < titleB) {
          return -1; // Change the order here
        }
        return 0;
      });
        res.status(200).json(results);
    } catch (error) {
        console.error("Error searching:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// get last 6 logs
app.get('/newest_logs', async (req, res) => {
    try {
        const logs = await Log.find().sort({ timestamp: -1 }).limit(6);
        res.status(200).json(logs);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// API Endpoint to Fetch Buildings with Architect and City
app.get('/buildings_frontend', async (req, res) => {
  try {
    // buildings counts 
    const buildings_per_page = 8 // 8 per page
    const page = req.query.page || 1; // number of page, initial is 1 
    const skip = (page - 1) * buildings_per_page 
    const {title, sorted} = req.query;
    let query = {};
    if (title) {
        const building_name = title;    
        const regex = new RegExp(building_name, "i");
        query.building_name = regex;
    }
    
    // Fetch all buildings with their addresses and cities
    let buildings;
    if(sorted == "true"){
      buildings = await Buildings_Model.find(query).limit(buildings_per_page).lean().limit(buildings_per_page).skip(skip).sort({building_name: 1})
    }else{
      buildings = await Buildings_Model.find(query).limit(buildings_per_page).lean().limit(buildings_per_page).skip(skip)
    }
    const buildingsCount = await Buildings_Model.countDocuments(query);
    const Counts_of_Pages = Math.ceil(buildingsCount / buildings_per_page) // Round up to nearest integer

    // Convert building _id values to strings
    const buildingIds = buildings.map((building) => building._id.toString());

    // Fetch all images for the buildings
    const images = await conn.db.collection('images').find({
      building_id: { $in: buildingIds },
      Type: 'Front Image',
    }).toArray();

    // Create a map of images by building ID for quick lookup
    const imageMap = images.reduce((map, image) => {
      
      map[image.building_id] = {
        image_id: image._id,
        file_id: image.fileId,
        filename: image.filename
      };

      return map;
    }, {});

    // Assign images and architects to their respective buildings
    buildings = buildings.map((building) => {
      const buildingId = building._id.toString();

      // Assign the corresponding image to the building
      if (imageMap[buildingId]) {
        building.image = imageMap[buildingId];
      }

      return building;
    });

    // Send updated buildings as the response
    res.status(200).json({buildings, Counts_of_Pages});
  } catch (error) {
    console.error('Error fetching buildings:', error); // Debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// API Endpoint to Fetch Notaries
app.get('/notaries', async (req, res) => {
  try {
        const notaries = await Notaries_Model.find(); 
        res.status(200).json(notaries);
  } catch (error) {
      console.error("Error fetching notaries:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// API Endpoint to Fetch Owners
app.get('/owners', async (req, res) => {
  try {
        const owners = await Owners_Model.find();
        res.status(200).json(owners);
  } catch (error) {
      console.error("Error fetching owners:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// API Endpoint to Fetch Tenant
app.get('/tenants', async (req, res) => {
  try {
        const tenants = await Tenants_Model.find();
        res.status(200).json(tenants);
  } catch (error) {
      console.error("Error fetching tenants:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Endpoint to Fetch BDR
app.get('/bdr', async (req, res) => {
  try {
        const bdrs = await bdr_Model.find();
        res.status(200).json(bdrs);
  } catch (error) {
      console.error("Error fetching Building During the Reign:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Endpoint to Fetch Countries
app.get("/countries", async (req, res) => {
  try {
    const countries = await Countries_Model.find(); // Fetch only required fields
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ error: "Error fetching countries" });
  }
});

// Fetch Cities by Country ID
app.get("/cities", async (req, res) => {
  try {
    const { country_id } = req.query;
    if (country_id) {
      const cities = await Cities_Model.find({ country_id });
      res.status(200).json(cities);
    } else {
      res.status(400).json({ message: "country_id is required" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching cities" });
  }
});


app.get("/images", async (req, res) => {
try {
      const images = await Images_Model.find();
      res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: "Error fetching images" });
  }
});


// Fetch Cities
app.get("/get-cities", async (req, res) => {
  try {
      const cities = await Cities_Model.find();
      res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cities" });
  }
});

app.get("/cities/:id/map", async (req, res) => {
  try {
    const city = await Cities_Model.findById(req.params.id);

    if (!city || !city.map || !city.map.data) {
      return res.status(404).json({ error: "Map not found" });
    }

    res.set("Content-Type", city.map.contentType);
    res.send(city.map.data);
  } catch (error) {
    console.error("Error fetching map:", error);
    res.status(500).json({ error: "Failed to fetch map" });
  }
});



// Fetch Addresses
app.get("/get-addresses", async (req, res) => {
  try {
      const addresses = await Addresses_Model.find();
      res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching addresses" });
  }
});

app.delete('/notaries/:id', async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const deletedNotary = await Notaries_Model.findByIdAndDelete(id);
        if (!deletedNotary) {
            return res.status(404).json({ message: 'Notary not found' });
        }
        res.json({ message: 'Notary deleted successfully' });
    } catch (error) {
        console.error('Error deleting notary:', error);
        res.status(500).json({ message: 'Error deleting notary', error });
    }
});



app.put('/notaries/:id', async (req, res) => {
    const { id } = req.params;
  const update = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const updatedNotary = await Notaries_Model.findByIdAndUpdate(id, update, { new: true });
        if (!updatedNotary) {
            return res.status(404).json({ message: 'Notary not found' });
        }
        res.status(200).json(updatedNotary);
    } catch (error) {
        console.error('Error updating notary:', error);
        res.status(500).json({ error: 'Error updating notary', error });
    }
});


// Add city
/*app.post("/add-cities", async (req, res) => {
  const { city_name, country_id } = req.body;

    try {
    const newCity = await Cities_Model.create({country_id, city_name });
   
    res.status(201).json({ message: "City added successfully!", cities: newCity});
  } catch (error) {
    res.status(500).json({ error: "Error adding city" });
  }
});*/

app.post("/add-cities", upload.single("map"), async (req, res) => {
  const { city_name, country_id } = req.body;

  try {
    // Create the city with the provided data
    const newCity = new Cities_Model({
      country_id,
      city_name,
    });

    // Attach the map file if it exists
    if (req.file) {
      newCity.map = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    // Save the city in the database
    await newCity.save();

    res.status(201).json({ message: "City and map added successfully!", city: newCity });
  } catch (error) {
    console.error("Error adding city with map:", error);
    res.status(500).json({ error: "Failed to add city with map" });
  }
});

// fetch all Architects
app.get("/Architects", async (req, res) => {
    try {
        const Architects = await Architects_Model.find(); 
        res.status(200).json(Architects);
    } catch (error) {
        console.error("Error fetching Architects:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// fetch archetict by id
app.get("/Architects_frontend/:id", async (req, res) => {
    try {
        const architect = await Architects_Model.findById(req.params.id).lean();
        if (!architect) {
            return res.status(404).json({ message: "Architect not found" });
        }
        let buildings_architect = await Buildings_Architects_Model.find({ architect_id: architect._id })
        .populate('building_id').lean();

        // Fetch front images for related buildings
        buildings_architect = await Promise.all(
          buildings_architect.map(async building => {
            if (!building || !building.building_id) return null;

            const images = await conn.db.collection('images').find({
              building_id: building.building_id._id.toString(),
            }).toArray();

            // Find the front image for the building
            const image = images.find(img => img.building_id === building.building_id._id.toString() && img.Type === 'Front Image');
            if (image) {
              building.building_id.image = {
                image_id: image._id,
                file_id: image.fileId,
                filename: image.filename,
              };
            }
            return building.building_id;
          })
        )
        architect.buildings = buildings_architect;
        
        res.status(200).json(architect);
    } catch (error) {
        console.error("Error fetching Architect:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// fetch all Architects depend on page or search
app.get("/Architects_frontend", async (req, res) => {
    try {
      // Architects counts 
      const architects_per_page = 8 // 8 per page
      const page = req.query.page || 1; // number of page, initial is 1 
      const skip = (page - 1) * architects_per_page 
      const {title, sorted} = req.query;
      let query = {};
      if (title) {
          const architect_name = title;    
          const regex = new RegExp(architect_name, "i");
          query.architect_name = regex;
      }
      let Architects;
      if(sorted == "true"){
        Architects = await Architects_Model.find(query).skip(skip).limit(architects_per_page).sort({architect_name: 1});
      }else{
        Architects = await Architects_Model.find(query).skip(skip).limit(architects_per_page);
      }
      const ArchitectsCount = await Architects_Model.countDocuments(query);
      const Counts_of_Pages = Math.ceil(ArchitectsCount / architects_per_page) // Round up to nearest integer
      res.status(200).json({Architects, Counts_of_Pages });
    } catch (error) {
        console.error("Error fetching Architects:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// fetch all usage
app.get("/usage", async (req, res) => {
    try {
        const usage = await Usage_Model.find(); 
        res.status(200).json(usage);
    } catch (error) {
        console.error("Error fetching usage:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// fetch all status
app.get("/status", async (req, res) => {
    try {
        const status = await Status_Model.find(); 
        res.status(200).json(status);
    } catch (error) {
        console.error("Error fetching status:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Add building testt
app.post("/AddBuilding", async (req, res) => {
  const { building_name,area, ar_description,en_description, thsLink, frontImageLink, dateOfConstruction, documentationDate, numberOfFloors, bdr_id, address_id} = req.body;

    try {
    const newBuilding = await Buildings_Model.create({building_name,area, ar_description,en_description,thsLink, frontImageLink, dateOfConstruction, documentationDate, numberOfFloors, bdr_id, address_id});
   
    res.status(201).json({ message: "Building added successfully!", buildings: newBuilding});
  } catch (error) {
    res.status(500).json({ error: "Error adding building" });
  }
});

// fetch all Buildings
app.get("/get-buildings", async (req, res) => {
    try {
        const building = await Buildings_Model.find(); 
        res.status(200).json(building);
    } catch (error) {
        console.error("Error fetching building:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.delete("/buildings/:id/:addressId", async (req, res) => {
  try {
    const { id: buildingId, addressId } = req.params;

    // Delete related records
    await Promise.all([
      Buildings_Status_Model.deleteMany({ building_id: buildingId }),
      Buildings_Usage_Model.deleteMany({ building_id: buildingId }),
      Buildings_Architects_Model.deleteMany({ building_id: buildingId }),
      Buildings_Notaries_Model.deleteMany({ building_id: buildingId }),
      Buildings_Owners_Model.deleteMany({ building_id: buildingId }),
      Buildings_Tenants_Model.deleteMany({ building_id: buildingId }),
      Images_Model.deleteMany({ building_id: buildingId }),
    ]);

    console.log("Related records deleted successfully.");

    // Delete the building itself
    const deletedBuilding = await Buildings_Model.findByIdAndDelete(buildingId);
    if (!deletedBuilding) {
      return res.status(404).json({ error: "Building not found" });
    }

    // Delete the related address
    const deletedAddress = await Addresses_Model.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      console.warn("Warning: Address not found or already deleted.");
    } else {
      console.log("Address deleted successfully.");
    }

    res.status(200).json({ message: "Building and related data deleted successfully." });
  } catch (error) {
    console.error("Error deleting building:", error);
    res.status(500).json({ error: "Failed to delete building." });
  }
});



// Add Address
app.post("/AddAddress", async (req, res) => {
  const {city_id, street, coordinates} = req.body;

    try {
    const newAddress = await Addresses_Model.create({city_id, street, coordinates});
   
    res.status(201).json({ message: "Address added successfully!", addresses: newAddress});
  } catch (error) {
    res.status(500).json({ error: "Error adding Address" });
  }
});

// Add buildings_Usages
app.post("/add-building-usage", async (req, res) => {
  const { building_id, usage_id, type } = req.body;

  // Validate the data
  if (!building_id || !usage_id || !type) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Create and save the new usage document
    const newUsage = new Buildings_Usage_Model({ building_id,usage_id,type, });
    await newUsage.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({
      message: "Building usage added successfully!",
      buildings_usages: newUsage,
    });
  } catch (error) {
    console.error("Error adding building usage:", error);
    res.status(500).json({ message: "An error occurred while adding usage." });
  }
});

//Add Buildings_status
app.post("/add-building-status", async (req, res) => {
  const { building_id, status_id } = req.body;

  try {
    // Create and save the new status document
    const newStatus = new Buildings_Status_Model({ building_id, status_id});
    await newStatus.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({
      message: "Building usage added successfully!",
      buildings_status: newStatus,
    });
  } catch (error) {
    console.error("Error adding building status:", error);
    res.status(500).json({ message: "An error occurred while adding status." });
  }
});


//Add Buildings_Architects
app.post("/add-buildings-architects", async (req, res) => {
  const { building_id, architect_id } = req.body;

  try {
    // Create and save the new architects document
    const newArchitects = new Buildings_Architects_Model({ building_id, architect_id});
    await newArchitects.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Buildings_Architects added successfully!",buildings_architects: newArchitects,});
  } catch (error) {
    console.error("Error adding Buildings_Architects:", error);
    res.status(500).json({ message: "An error occurred while adding Buildings_Architects." });
  }
});

/*
//Add Architects
app.post("/add-architect", async (req, res) => {
  const { architect_name, architect_image, en_biography, ar_biography} = req.body;

  try {
    // Create and save the new notary document
    const newArchitects = new Architects_Model({architect_name, architect_image, en_biography, ar_biography});
    await newArchitects.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Architects added successfully!", architects: newArchitects,});
  } catch (error) {
    console.error("Error adding Architects:", error);
    res.status(500).json({ message: "An error occurred while adding Architects." });
  }
});


*/


// Upload endpoint
app.post('/add-architect', upload.single('file'), async (req, res) => {
    try {
        // Validate the file
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { architect_name, ar_biography,  en_biography} = req.body; // Get the name and biography from the request body

        // Create a writable stream to GridFS
        const stream = gfs.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
        });

        // Upload the file buffer to the stream
        stream.end(req.file.buffer);

        // Handle stream events
        stream.on('finish', async () => {
            try {
                // Save file metadata and additional details in the architects collection
                const architectsDoc = await conn.db.collection('architects').insertOne({
                    fileId: stream.id,
                    architect_name,
                    ar_biography,
                    en_biography,
                    filename: req.file.originalname,
                });

                res.status(200).json({
                    message: 'File uploaded successfully',
                    file: {
                        id: stream.id,
                        architect_name,
                        ar_biography,
                        en_biography
                    },
                });
            } catch (error) {
                console.error('Error saving file metadata:', error);
                res.status(500).json({ error: 'Failed to save architect' });
            }
        });

        stream.on('error', (err) => {
            console.error('Stream error:', err);
            res.status(500).json({ error: 'Architect Add failed' });
        });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Edit Arch
app.put('/architects/:id', async (req, res) => {
  const { id } = req.params;
  const { architect_name, en_biography, ar_biography} = req.body;

  try {

    const updatedArchitect = await Architects_Model.findByIdAndUpdate(
      id,
      { architect_name, ar_biography, en_biography},
      { new: true }
    );

    if (!updatedArchitect) {
      console.error("Architect not found with ID:", id);
      return res.status(404).json({ message: 'Architect not found' });
    }

    res.status(200).json(updatedArchitect);
  } catch (error) {
    console.error("Error updating architect:", error.message);
    res.status(500).json({ message: 'Error updating architect', error: error.message });
  }
});


//Add Notary
app.post("/add-notary", async (req, res) => {
  const { notary_name} = req.body;

  try {
    // Create and save the new notary document
    const newNotary = new Notaries_Model({notary_name});
    await newNotary.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "notary added successfully!", notaries: newNotary,});
  } catch (error) {
    console.error("Error adding notary:", error);
    res.status(500).json({ message: "An error occurred while adding notary." });
  }
});


//Add Buildings_Notaries
app.post("/add-buildings-notaries", async (req, res) => {
  const { building_id, notary_id, building_name } = req.body;

  try {
    // Create and save the new notary document
    const newNotary = new Buildings_Notaries_Model({ building_id, notary_id, building_name});
    await newNotary.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Buildings_Notaries added successfully!", buildings_notaries: newNotary,});
  } catch (error) {
    console.error("Error adding Buildings_Notaries:", error);
    res.status(500).json({ message: "An error occurred while adding Buildings_Notaries." });
  }
});

//Add Buildings_Owners
app.post("/add-buildings-owners", async (req, res) => {
  const { building_id, owner_id } = req.body;

  try {
    // Create and save the new Owners document
    const newOwners = new Buildings_Owners_Model({ building_id, owner_id});
    await newOwners.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Buildings_Owners added successfully!", buildings_owners: newOwners,});
  } catch (error) {
    console.error("Error adding Buildings_Owners:", error);
    res.status(500).json({ message: "An error occurred while adding Buildings_Owners." });
  }
});

//Add Owners
app.post("/add-owner", async (req, res) => {
  const { owner_name} = req.body;

  try {
    // Create and save the new notary document
    const newOwner = new Owners_Model({owner_name});
    await newOwner.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "owner added successfully!", owners: newOwner,});
  } catch (error) {
    console.error("Error adding owner:", error);
    res.status(500).json({ message: "An error occurred while adding owner." });
  }
});


//Add Buildings_Tenant
app.post("/add-buildings-tenants", async (req, res) => {
  const { building_id, tenant_id } = req.body;

  try {
    // Create and save the new Tenant document
    const newTenant = new Buildings_Tenants_Model({ building_id, tenant_id});
    await newTenant.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "buildings_tenants added successfully!", buildings_tenants: newTenant,});
  } catch (error) {
    console.error("Error adding buildings_tenants:", error);
    res.status(500).json({ message: "An error occurred while adding buildings_tenants." });
  }
});

//Add Tenant
app.post("/add-tenant", async (req, res) => {
  const { tenant_name} = req.body;

  try {
    // Create and save the new notary document
    const newTenant = new Tenants_Model({tenant_name});
    await newTenant.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Tenant added successfully!", tenants: newTenant,});
  } catch (error) {
    console.error("Error adding Tenant:", error);
    res.status(500).json({ message: "An error occurred while adding Tenant." });
  }
});


app.get('/notaries/:id/buildings', async (req, res) => {
  const { id } = req.params;
  try {
    const notaryBuildings = await Buildings_Notaries_Model.find({ notary_id: id })
      .populate('building_id');

    const buildingsWithDetails = notaryBuildings.map(buildings => {
      if (!buildings.building_id) {
        return null; // Handle missing data
      }
      return {
        building_id: buildings.building_id._id,
        building_name: buildings.building_id.building_name,
      };
    }).filter(Boolean); // Remove null entries

    res.status(200).json(buildingsWithDetails);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});


app.get('/architects/:id/buildings', async (req, res) => {
  const { id } = req.params;
  try {
    const architectBuildings = await Buildings_Architects_Model.find({ architect_id: id })
      .populate('building_id');


    const buildingsWithDetails = architectBuildings.map(buildings => {
      if (!buildings.building_id) {
        return null; // Handle missing data
      }
      return {
        building_id: buildings.building_id._id,
        building_name: buildings.building_id.building_name,
      };
    }).filter(Boolean); // Remove null entries

    res.status(200).json(buildingsWithDetails);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});



app.get('/owners/:id/buildings', async (req, res) => {
  const { id } = req.params;
  try {
    const ownerBuildings = await Buildings_Owners_Model.find({ owner_id: id })
      .populate('building_id');

    const buildingsWithDetails = ownerBuildings.map(building => {
      if (!building.building_id) {
        return null; // Handle missing data
      }
      return {
        building_id: building.building_id._id,
        building_name: building.building_id.building_name,
      };
    }).filter(Boolean); // Remove null entries

    res.status(200).json(buildingsWithDetails);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});


app.get('/tenants/:id/buildings', async (req, res) => {
  const { id } = req.params;
  try {
    const tenantBuildings = await Buildings_Tenants_Model.find({ tenant_id: id })
      .populate('building_id');


    const buildingsWithDetails = tenantBuildings.map(building => {
      if (!building.building_id) {
        return null; // Handle missing data
      }
      return {
        building_id: building.building_id._id,
        building_name: building.building_id.building_name,
      };
    }).filter(Boolean); // Remove null entries

    res.status(200).json(buildingsWithDetails);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});


// Update tenant by ID
app.put("/tenants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { tenant_name } = req.body;

    if (!tenant_name) {
      return res.status(400).json({ error: "Tenant name is required" });
    }

    const tenant = await Tenants_Model.findByIdAndUpdate(
      id,
      { tenant_name },
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    res.json(tenant);
  } catch (err) {
    console.error("Error updating tenant:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update owner by ID
app.put("/owners/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_name } = req.body;

    if (!owner_name) {
      return res.status(400).json({ error: "Owner name is required" });
    }

    const owner = await Owners_Model.findByIdAndUpdate(
      id,
      { owner_name },
      { new: true }
    );

    if (!owner) {
      return res.status(404).json({ error: "owner not found" });
    }

    res.json(owner);
  } catch (err) {
    console.error("Error updating owner:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Update notaries by ID
app.put("/notaries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { notary_name } = req.body;

    if (!notary_name) {
      return res.status(400).json({ error: "Notary name is required" });
    }

    const notary = await Notaries_Model.findByIdAndUpdate(
      id,
      { notary_name },
      { new: true }
    );

    if (!notary) {
      return res.status(404).json({ error: "notary not found" });
    }

    res.json(notary);
  } catch (err) {
    console.error("Error updating notary:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get('/buildings/:id/status', async (req, res) => {
  const { id } = req.params;
  try {

    // Find all statuses related to the given building_id
    const statusBuildings = await Buildings_Status_Model.find({ building_id: id })
      .populate('status_id', 'status_name _id'); // Populate only required fields from the Status collection


    // Map statuses to include the necessary details
    const statusWithDetails = statusBuildings.map(status => {
      if (!status.status_id) {
        return null; // Handle missing data
      }
      return {
        status_id: status.status_id._id, // Use the populated status data
        status_name: status.status_id.status_name,
      };
    }).filter(Boolean); // Remove null entries caused by missing data

    // Send the response
    res.status(200).json(statusWithDetails);

  } catch (error) {
    console.error("Error fetching building statuses:", error);
    res.status(500).json({ error: 'Failed to fetch building statuses' });
  }
});


app.get('/buildings/:id/usage', async (req, res) => {
  const { id } = req.params;
  try {

    // Find all usage related to the given building_id in the Buildings_Usage collection
    const usageBuildings = await Buildings_Usage_Model.find({ building_id: id })
      .populate('usage_id', 'use_type') // Populate the usage_id with the name (use_type) from the Usage collection
      .select('usage_id type'); // Select usage_id and type from Buildings_Usage collection directly

    // Map usage to include the necessary details
    const usageWithDetails = usageBuildings.map(usage => {
      if (!usage.usage_id) {
        return null; // Handle missing data
      }
      return {
        usage_id: usage.usage_id._id, // Use the populated usage data (usage_id)
        usage_name: usage.usage_id.use_type, // Get the use_type (name) from the populated usage_id
        type: usage.type, // Add the type field from Buildings_Usage collection
      };
    }).filter(Boolean); // Remove null entries caused by missing data

    // Send the response
    res.status(200).json(usageWithDetails);

  } catch (error) {
    console.error("Error fetching building usage:", error);
    res.status(500).json({ error: 'Failed to fetch building usage' });
  }
});


app.get('/images-by-building/:buildingId', async (req, res) => {
    const { building_id } = req.params;

    try {
        // Validate building existence
        const building = await Buildings_Model.findById(building_id);
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }

        // Fetch images for the building
        const images = await Image.find({ building_id: building_id }).select('image description');

        res.json({
            building: {
                id: building._id,
                name: building.building_name,
            },
            images,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
//Fetch a Building by ID
app.get('/buildings/:id', async (req, res) => {
  try {
    const building = await Buildings_Model.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }
    res.json(building);
  } catch (error) {
    console.error('Error fetching building:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/buildings_frontend/:id', async (req, res) => {
  try {
    // Find the building by _id from the database
    let building = await Buildings_Model.findById(req.params.id)
      .lean()
      .populate({
        path: 'address_id',
        populate: {
          path: 'city_id',
          populate: {
            path: 'country_id', // Populate country_id inside city_id
          },
        },
      })
      .populate('bdr_id'); // Populate bdr_id

    if (!building) {
      return res.status(404).json({ error: "Building not found" });
    }

    // Fetch all images where building_id matches the building's _id
    const images = await conn.db.collection('images').find({
      building_id: building._id.toString(),
    }).toArray();

    if (images.length > 0) {
      // Assign all image details (with proper URL handling) to the building
      building.images = images.map(image => {
        return {
          type: image.Type, // Include the Type of the image
          filename: image.filename
        };
      });
    } else {
      building.images = []; // No images found
    }

    // Fetch related data
    const buildings_architect = await Buildings_Architects_Model.find({ building_id: req.params.id })
      .populate('architect_id')
      .lean();
    const buildings_notaries = await Buildings_Notaries_Model.find({ building_id: req.params.id })
      .populate('notary_id');
    const buildings_Usages = await Buildings_Usage_Model.find({ building_id: req.params.id })
      .populate('usage_id');
    const buildings_owners = await Buildings_Owners_Model.find({ building_id: req.params.id })
      .populate('owner_id');
    const buildings_statuses = await Buildings_Status_Model.find({ building_id: req.params.id })
      .populate('status_id');
    const buildings_tenants = await Buildings_Tenants_Model.find({ building_id: req.params.id })
      .populate('tenant_id');

    // Process architects and related buildings
    if (buildings_architect.length > 0) {
      for (const architectRelation of buildings_architect) {
        const architectId = architectRelation.architect_id._id;

        // Fetch all buildings associated with this architect
        let relatedBuildings = await Buildings_Architects_Model.find({ architect_id: architectId })
          .populate({
            path: 'building_id',
            populate: [
              {
                path: 'address_id',
                populate: {
                  path: 'city_id',
                  populate: { path: 'country_id' },
                },
              },
              { path: 'bdr_id' },
            ],
          })
          .lean();

        // Fetch front images for related buildings
        relatedBuildings = await Promise.all(
          relatedBuildings.map(async relatedBuilding => {
            if (!relatedBuilding || !relatedBuilding.building_id) return null;

            const images = await conn.db.collection('images').find({
              building_id: relatedBuilding.building_id._id.toString(),
            }).toArray();

            // Find the front image for the building
            const image = images.find(img => img.building_id === relatedBuilding.building_id._id.toString() && img.Type === 'Front Image');
            if (image) {
              relatedBuilding.building_id.image = {
                image_id: image._id,
                file_id: image.fileId,
                filename: image.filename,
              };
            }
            return relatedBuilding.building_id;
          })
        );

        // Filter out null values and the current building
        architectRelation.architect_id.relatedBuildings = relatedBuildings.filter(
          relBuilding => relBuilding && relBuilding._id.toString() !== building._id.toString()
        );
      }
    }

    // Assign related data to the building
    building.architects = buildings_architect;
    building.notaries = buildings_notaries;
    building.usages = buildings_Usages;
    building.owners = buildings_owners;
    building.statuses = buildings_statuses;
    building.tenants = buildings_tenants;

    // Return the building with all associated data
    res.status(200).json(building);
  } catch (error) {
    console.error("Error fetching building:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/buildings/:building_id/images', async (req, res) => {
  try {
    // Find images related to the building by building_id from the database
    const buildingImages = await Images_Model.find({ building_id: req.params.building_id });

    if (buildingImages.length > 0) {
      res.json(buildingImages);  // Return image data if images found
    } else {
      res.status(404).json({ message: 'Images not found' });  // Return error if no images are found
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Server setup
app.listen(5000, () => {
    console.log("Server is running on port 3001");
});