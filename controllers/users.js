const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

module.exports = {
  signup,
  login,
  getAll,
  getOne,
  update,
  deleteAll
}

function createJWT(user) {
  return jwt.sign(
    {user}, // data payload
    SECRET,
    {expiresIn: '24h'}
  );
}

async function signup (req, res) {
  let dummy = {
    username: req.body.username,
    email: req.body.email,
    age: req.body.age,
    password: req.body.password,
    description: req.body.description,
    whatToOffer: req.body.whatToOffer,
    ageRanges: {
      range: req.body.ageRanges.range,
      low: req.body.ageRanges.low,
      high: req.body.ageRanges.high
    },
    match: req.body.match
  }

  try {
    const user = await User.create(dummy);
    const token = createJWT(user);
    res.json({ token });
  } catch (err) {
    res.status(400).json(err);
  }
}

async function update (req, res) {
  try {
    const user = await User.findOne({ username: req.params.id })

    user.username = req.body.username;
    user.email = req.body.email;
    user.age = req.body.age;
    user.description = req.body.description;
    user.whatToOffer = req.body.whatToOffer;
    user.ageRanges = req.body.ageRanges;
    user.ageRanges.range = req.body.ageRanges.range;
    user.ageRanges.low = req.body.ageRanges.low;
    user.ageRanges.high = req.body.ageRanges.high;
    user.match = req.body.match;

    user.save();
    const token = createJWT(user);
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json(err);
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({email: req.body.email});
    console.log(user)
    if (!user) return res.status(401).json({err: 'bad credentials'});

    user.comparePassword(req.body.password, (err, isMatch) => {

      if (isMatch) {
        const token = createJWT(user);
        res.json({token});
      } else {
        return res.status(401).json({err: 'bad credentials'});
      }
    });
  } catch (err) {
    return res.status(401).json(err);
  }
}

async function deleteAll (req, res) {
  try {
    let deletedCount = await User.deleteMany({});
    res.status(200).json({ deletedCount });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getAll(req, res) {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (err) {
    res.json({ error: err })
  }
};

async function getOne(req, res) {
    try {
      const user = await User.find({ username: req.params.id });
      res.status(200).json({ user });
    } catch (err) {
      res.json({ data: err });
    }
};
