
const { checkEmailExists, checkPasswordCorrect, createUser , getUserID, getBalance, setBalance, setGoal, getGoal} = require('../services/userService');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const emailExists = await checkEmailExists(email);
        if (!emailExists) {
            return res.send({ success: false, error: 'Email does not exist' });
        }

        const passwordCorrect = await checkPasswordCorrect(email, password);
        if (!passwordCorrect) {
            return res.send({ success: false, error: 'Incorrect password' });
        }

        const userId = await getUserID(email);
        const token = jwt.sign({
            id: userId,
            email: email
        }, "my key", { expiresIn: '1d' });

        res.send({ success: true, token: token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).send({ success: false, error: error.message });
    }
}
  
  exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Checking if email exists');
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return res.send({ success: false, error: 'Email already in use' });
        }

        console.log('Creating user');
        await createUser(email, password);

        console.log('Getting user ID');
        const userId = await getUserID(email);
        
        console.log('Creating JWT token');
        const token = jwt.sign({
            id: userId,
            email: email
        }, "my key", { expiresIn: '1d' });

        res.send({ success: true, token: token });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).send({ success: false, error: error.message });
    }
}
  
  exports.balance = async (req, res) => {
    const userID = req.user.id;
    try {
        const result = await getBalance(userID);
        res.send({ result: result });
    } catch (error) {
        console.error('Error getting balance:', error);
        res.status(500).send({ success: false, error: error.message });
    }
}

exports.goal = async (req, res) => {
    const userID = req.user.id;
    try {
        const result = await getGoal(userID);
        res.send({ result: result });
    } catch (error) {
        console.error('Error getting balance:', error);
        res.status(500).send({ success: false, error: error.message });
    }
}
exports.setBalance = async(req , res) => {
    const {balance} = req.body;
    const userID = req.user.id;
    try{
        const result = await setBalance(userID, balance) 
        res.send({result : result});
   }catch(error) {
        console.error('error when trying to set balance: ' , error);
        res.status(500).send({success : false , error : error.message});
   }
}
exports.setGoal = async(req , res) => {
    const {goal} = req.body;
     const userID = req.user.id;
    try{
        const result = await setGoal(userID, goal) 
    res.send({result : result});
   }catch(error) {
    console.error('error when trying to set goal ' , error);
    res.status(500).send({success : false , error : error.message});
   }
}