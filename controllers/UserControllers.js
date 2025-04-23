const { User } = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

class UserControllers {

    static async registerUser (req, res, next) {
        try {
            const { name, email, password, role } = req.body;

            // cek input form
            if (!email || !password || !name) {
                throw { status: 400, message: 'Name, email, and password are required' }
            }

            // Optional: cek apakah email sudah terdaftar
            const exist = await User.findOne({ where: { email } });
            // if (exist) return res.status(409).json({ message: 'Email already registered' });
            if (exist) {
                throw { status: 409, message: 'Email already registered' }
            }
          
            const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);

            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                role: role || 'user'
            });

            res.status(201).json({
                message: 'Register successful',
                user: {
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            });

        } catch (error) {
            console.log(error, "==> SINI");
            next(error)
        }
    }

    static async loginUser (req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) throw { message: 'Invalid email or password' };

            const valid = await bcrypt.compare(password, user.password);
            
            if (!valid) throw { message: 'Invalid email or password' };

            const payload = { id: user.id, email: user.email };
            const token = jwt.sign(payload, process.env.JWT_SECRET);

            res.status(200).json({ accessToken: token });

        } catch (error) {
            next({ status: 401, message: error.message || 'Unauthorized access' })
        }
    }

    static async getAllUsers(req, res) {
        try {
            const dataUsers = await User.findAll({ 
                raw: true ,
                attributes: ['name', 'role'],
            })
            
            res.status(200).json({ data: dataUsers })
        } catch (error) {
            res.status(500).json(error)
        }
    }
}


module.exports = UserControllers