var UserDB = require('../model/user');
var ItemsDB = require('../model/items');
var OrderDB = require('../model/order');
var ServiceOrderDB = require('../model/serviceOrder');
var TokenDB = require('../model/tokens');
var LogsDB = require('../model/logs');
const nodemailer = require('nodemailer');
const axios = require('axios');
const xml2js = require('xml2js');

//referencias del model cual trae una construcción de las tablas
//todos estos metodos de abajo son las los api de la tienda

  const createUser = (req, res) => {
    const usuario = new UserDB({
        IdDocument: req.body.IdDocument,
        FirstName:req.body.FirstName,
        LastName:req.body.LastName,
        Email:req.body.Email,
        Password:req.body.Password,
        State:req.body.State,
        Canton:req.body.Canton,
        District:req.body.District,
        SecurityQuestion1:req.body.SecurityQuestion1,
        SecurityQuestion2:req.body.SecurityQuestion2,
        SecurityQuestion3:req.body.SecurityQuestion3,
        Status:req.body.Status,
    })
  
    usuario
        .save(usuario)
        .then(data =>{
            res.send(data)
        })
        .catch(err=>{
            res.status(500).send({
                message:err.message||"Algun error ha ocurrido mientras se registra el usuario."
            })
        })
  };

  const updateUserRecovery = (req, res) => {
    const email = req.body.Email;
    const newPassword = req.body.Password;
    const newStatus = req.body.Status;

    UserDB.findOneAndUpdate(
      { Email: email },
      { Password: newPassword, Status: newStatus },
      { new: true }
    )
    .then(data => {
        if (data.Email === req.body.Email) {
            res.send(true);
        }
        else{
          res.send(false);
        }
    })
    .catch(err => {
        res.status(500).send({
          message:err.message||"Algun error ha ocurrido mientras se actualiza el usuario"
        })
    });
};

  const validateUser = (req, res) => {
    UserDB.findOne({
      Email: req.body.Email,
      Password: req.body.Password
    })
    .then(data =>{
      if (data.Email === req.body.Email && data.Password === req.body.Password && data.Status === 'Active') {
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch(err=>{
      res.status(500).send({
          message:err.message||"Algun error ha ocurrido mientras se logea el usuario"
      })
    });
  }

  const validateQuestion = (req, res) => {
    const { Email, SecurityQuestion, currentQuestionIndex  } = req.body;

    UserDB.findOne({
        Email: Email
    })
    .then(data => {
        if (data) {
            switch (currentQuestionIndex) {
                case 0:
                    if (SecurityQuestion.toLowerCase() === data.SecurityQuestion1.toLowerCase()) {
                        res.send(true);
                    } else {
                        res.send(false);
                    }
                    break;
                case 1:
                    if (SecurityQuestion.toLowerCase() === data.SecurityQuestion2.toLowerCase()) {
                        res.send(true);
                    } else {
                        res.send(false);
                    }
                    break;
                case 2:
                    if (SecurityQuestion.toLowerCase() === data.SecurityQuestion3.toLowerCase()) {
                        res.send(true);
                    } else {
                        res.send(false);
                    }
                    break;
                default:
                    res.send(false);
                    break;
            }
        } else {
            res.send(false);
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Algun error ha ocurrido mientras se valida la pregunta"
        });
    });
}




const validateEmail = (req, res) => {
  UserDB.findOne({
      Email: req.body.Email
  })
  .then(data => {
      if (data) {
          res.send(true);
      } else {
          res.send(false); 
      }
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || "Se produjo un error al validar el usuario"
      });
  });
}
const validateIdDocument = (req, res) => {
  UserDB.findOne({
      IdDocument: req.body.IdDocument
  })
  .then(data => {
      if (data) {
          res.send(true);
      } else {
          res.send(false); 
      }
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || "Se produjo un error al validar el usuario"
      });
  });
}



  const createItems = (req, res) => {
    const item = new ItemsDB({
        Manufacturer:req.body.Manufacturer,
        Model:req.body.Model,
        ColorInstrumentText:req.body.ColorInstrumentText,
        DescriptionInstrument:req.body.DescriptionInstrument,
        Price:req.body.Price,
        Currency:req.body.Currency,
        ColorInstrumentHex:req.body.ColorInstrumentHex,
        Category:req.body.Category,
        Thumbnail:req.body.Thumbnail,
    })
  
    item
        .save(item)
        .then(data =>{
            res.send(data)
        })
        .catch(err=>{
            res.status(500).send({
                message:err.message||"Algun error ha ocurrido mientras se registra el item."
            })
        })
  };

  const getItemsByCategory = (req, res) => {
    if(req.params.category){
      ItemsDB.find({
        Category: req.params.category,
      })
      .then(data =>{
        res.send(data)
      })
      .catch(err=>{
        res.status(500).send({
            message:err.message||"Ha ocurrido un error."
        })
      });
    }
  }

  const getItemById = (req, res) => {
    if(req.params.id){
      ItemsDB.findOne({
        _id: req.params.id,
      })
      .then(data =>{
        res.send(data)
      })
      .catch(err=>{
        res.status(500).send({
            message:err.message||"Ha ocurrido un error."
        })
      });
    }
  }

  const createOrder = (req, res) => {
    const order = new OrderDB({
        CustomerName:req.body.CustomerName,
        Email:req.body.Email,
        CustomerState:req.body.CustomerState,
        CustomerCanton:req.body.CustomerCanton,
        IdItem:req.body.IdItem
    })
  
    order
        .save(order)
        .then(data =>{
            res.send(data)
        })
        .catch(err=>{
            res.status(500).send({
                message:err.message||"Algun error ha ocurrido mientras se registra el item."
            })
        })
  };

  const serviceOrder = (req, res) => {
    const order = new ServiceOrderDB({
        CustomerName:req.body.CustomerName,
        Email:req.body.Email,
        CustomerState:req.body.CustomerState,
        CustomerCanton:req.body.CustomerCanton,
        Service:req.body.Service,
        CustomerDescription: req.body.CustomerDescription
    })
  
    order
        .save(order)
        .then(data =>{
            res.send(data)
        })
        .catch(err=>{
            res.status(500).send({
                message:err.message||"Algun error ha ocurrido mientras se registra el item."
            })
        })
  };

  const createAccountToken = (req, res) => {
    const token = new TokenDB({
        Email:req.body.Email,
        Token:req.body.Token
        
    })
  
    token
        .save(token)
        .then(data =>{
            res.send(data)
            sendEmail(req.body.Email, req.body.Token);
        })
        .catch(err=>{
            res.status(500).send({
                message:err.message||"Algun error ha ocurrido mientras se registra el item."
            })
        })
  };

//send to confirmate the creation of account
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deceptiondiver@gmail.com',
        pass: 'huva aayd sjui gmoq'
    }
});

const sendEmail = (email, token) => {
  const mailOptions = {
      from: 'Resonancia',
      to: email,
      subject: 'Token Verification',
      text: `Your token is: ${token}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
      } else {
          console.log('Email sent:', info.response);
      }
  });

};

const validateCreationToken = (req, res) => {
  TokenDB.findOne({
    Email: req.body.Email,
    Token: req.body.Token
  })
  .then(data =>{
    if (data.Email === req.body.Email && data.Token === req.body.Token) {
      res.send(true);
    } else {
      res.send(false);
    }
  })
  .catch(err=>{
    res.status(200).send(false);
  });
}

const inactiveAccount = (req, res) => {
  const email = req.body.Email;
  const newStatus = req.body.Status;

  UserDB.findOneAndUpdate(
    { Email: email },
    {Status: newStatus },
    { new: true }
  )
  .then(data => {
      if (data.Email === req.body.Email) {
          res.send(true);
      }
      else{
        res.send(false);
      }
  })
  .catch(err => {
      res.status(500).send({
        message:err.message||"Algun error ha ocurrido mientras se actualiza el usuario"
      })
  });
};


const sendLocal = (req, res) => {
  UserDB.findOne({
    Email: req.body.Email,
    Password: req.body.Password
  })
  .then(data =>{
    res.send(data)
  })
  .catch(err=>{
    res.status(500).send({
        message:err.message||"Algun error ha ocurrido mientras se logea el usuario"
    })
  });
}

const DeleteToken = (req, res) => {
  TokenDB.deleteMany({
      Email: req.body.Email,
  })
  .then(data =>{
    if (data.Email === req.body.Email) {
      res.send(true);
    } else {
      res.send(false);
    }
  })
  .catch(err=>{
    res.status(200).send(false);
  });
}

const createLog = (req, res) => {
  const log = new LogsDB({
      Email:req.body.Email,
      Action:req.body.Action,
  })

  log
      .save(log)
      .then(data =>{
          res.send(data)
      })
      .catch(err=>{
          res.status(500).send({
              message:err.message||"Algun error ha ocurrido mientras se registra el usuario."
          })
      })
};
//dollar
const getDollarValue = async (req, res) => {
  try {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const fechaActual = `${day}/${month}/${year}`;

      // Parámetros para la solicitud al servicio web del Banco Central de Costa Rica
      const indicador = 317;
      const fechaInicio = fechaActual;
      const fechaFinal = fechaActual;
      const nombre = 'Esteban';
      const subNiveles = 'N';
      const correoElectronico = 'esteban.f.mata.mena@gmail.com';
      const token = 'EEG7M71MTN';

      // Realizar la solicitud al servicio web del Banco Central de Costa Rica
      const response = await axios.get('https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML', {
          params: {
              indicador: indicador,
              fechaInicio: fechaInicio,
              fechaFinal: fechaFinal,
              nombre: nombre,
              subNiveles: subNiveles,
              correoElectronico: correoElectronico,
              token: token
          }
      });

      // Parsear la respuesta XML
      const xmlData = await xml2js.parseStringPromise(response.data);

      // Extraer el valor de compra del dólar
      let valorCompraDolar;
      if (xmlData && xmlData.string && xmlData.string._) {
          const datos = xmlData.string._;
          const parser = new xml2js.Parser({ explicitArray: false });
          parser.parseString(datos, (err, result) => {
              if (err) {
                  console.error('Error al parsear la respuesta XML:', err);
                  return;
              }
              valorCompraDolar = parseFloat(result.Datos_de_INGC011_CAT_INDICADORECONOMIC.INGC011_CAT_INDICADORECONOMIC.NUM_VALOR);

              // Enviar solo el valor de compra del dólar como respuesta
              res.send(String(valorCompraDolar));
          });
      } else {
          console.error('Estructura de respuesta XML inesperada:', xmlData);
          res.status(500).send('Error al obtener el valor de compra del dólar');
      }

  } catch (error) {
      console.error('Error al obtener el valor de compra del dólar:', error);
      res.status(500).send('Error al obtener el valor de compra del dólar');
  }
}
//cedula
const findIdDocument = async (req, res) => {
  try {
    const Identification = req.body.Identification;

      const response = await axios.get('https://apis.gometa.org/cedulas/' + Identification);
      
      if (response.data && response.data.results && response.data.results.length > 0) {
          const result = response.data.results[0];
          const firstname = result.firstname;
          const temp = result.temp;
          res.send({ firstname, temp });
      } else {
          res.status(404).send('No se encontró la información para la cédula proporcionada');
      }
  } catch (error) {
      console.error('Error al buscar la cédula:', error);
      res.status(500).send('Error al buscar la cédula');
  }
}

//python a javascript
const completePurchase = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);
    const { creditCard, monthExpiration, yearExpiration, cvv, amount, productCharge } = req.body;
    const remainingAmount = amount - productCharge;
    if (remainingAmount < 0 || !creditCard || creditCard.length !== 16 || !(/^\d+$/.test(creditCard))) {
      console.log("fallo de digitos")
        return res.json(false);
    }

    const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

if (Number(yearExpiration) < currentYear ||
    (Number(yearExpiration) === currentYear && Number(monthExpiration) <= currentMonth)) {
    console.log("La tarjeta de crédito ha expirado.");
    return res.json(false);
}

    if (cvv.length !== 3 || !(/^\d+$/.test(cvv))) {
      console.log("fallo de cvv")
        return res.json(false);
    }

    // Procesar la compra y devolver true si es exitosa
    // ...

    console.log('Compra completada exitosamente');
    return res.json(true);
  } catch (error) {
      console.error('Error al completar la compra:', error);
      return res.status(500).json(false);
  }
};


module.exports = {
  createUser,
  validateUser,
  validateQuestion,
  validateEmail,
  createItems,
  getItemsByCategory,
  getItemById,
  createOrder,
  serviceOrder,
  createAccountToken,
  validateCreationToken,
  sendLocal,
  DeleteToken,
  updateUserRecovery,
  inactiveAccount,
  createLog,
  getDollarValue,
  findIdDocument,
  validateIdDocument,
  completePurchase
};