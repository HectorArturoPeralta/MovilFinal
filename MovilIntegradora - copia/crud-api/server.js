const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'arturo1234',
  database: 'u475816193_dbdropping'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Definición de las entidades y los endpoints CRUD
const entities = {
  administrador: ['Nombre', 'ClaveUnica', 'Contraseña', 'Fecha_nac', 'RFC', 'CURP', 'Direccion', 'Comentarios', 'Estado'],
  cliente: ['Nombre', 'Municipio', 'Direccion', 'Celular', 'Correo', 'Contraseña', 'Estado'],
  empleado: ['Nombre', 'CURP', 'RFC', 'Direccion', 'Fecha_nac', 'Contraseña', 'Estado', 'Telefono'],
  tinaco: ['id_cliente', 'Litros', 'Nivel'],
  mantenimientos: ['id_Tinaco', 'Comentarios', 'Realizado', 'Fecha', 'Hora'],
  mensajes: ['id_cliente', 'Mensaje', 'Fecha', 'Hora'],
  sensores: ['id_sensor', 'id_tinaco', 'fecha', 'hora', 'distancia']
};

Object.keys(entities).forEach(entity => {
  // Create
  app.post(`/api/${entity}`, (req, res) => {
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');
    const sql = `INSERT INTO ${entity} (${columns}) VALUES (${placeholders})`;
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(`Error inserting into ${entity}:`, err);
        return res.status(500).send(err);
      }
      res.status(201).send(result);
    });
  });

  // Read all
  app.get(`/api/${entity}`, (req, res) => {
    const sql = `SELECT * FROM ${entity}`;
    db.query(sql, (err, results) => {
      if (err) {
        console.error(`Error reading from ${entity}:`, err);
        return res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  });

  // Read by id
  app.get(`/api/${entity}/id/:id`, (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM ${entity} WHERE id = ?`;
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error(`Error reading from ${entity} by id:`, err);
        return res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  });

  // Read by nombre
  app.get(`/api/${entity}/nombre/:nombre`, (req, res) => {
    const { nombre } = req.params;
    const sql = `SELECT * FROM ${entity} WHERE Nombre = ?`;
    db.query(sql, [nombre], (err, results) => {
      if (err) {
        console.error(`Error reading from ${entity} by nombre:`, err);
        return res.status(500).send(err);
      }
      res.status(200).send(results);
    });
  });

  // Update by id
  app.put(`/api/${entity}/id/:id`, (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const columns = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    const sql = `UPDATE ${entity} SET ${columns} WHERE id = ?`;
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(`Error updating ${entity} by id:`, err);
        return res.status(500).send(err);
      }
      res.status(200).send(result);
    });
  });

  // Update by nombre
  app.put(`/api/${entity}/nombre/:nombre`, (req, res) => {
    const { nombre } = req.params;
    const data = req.body;
    const columns = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(nombre);
    const sql = `UPDATE ${entity} SET ${columns} WHERE Nombre = ?`;
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(`Error updating ${entity} by nombre:`, err);
        return res.status(500).send(err);
      }
      res.status(200).send(result);
    });
  });

  // Delete by id
  app.delete(`/api/${entity}/id/:id`, (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM ${entity} WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(`Error deleting from ${entity} by id:`, err);
        return res.status(500).send(err);
      }
      res.status(200).send(result);
    });
  });

  // Delete by nombre
  app.delete(`/api/${entity}/nombre/:nombre`, (req, res) => {
    const { nombre } = req.params;
    const sql = `DELETE FROM ${entity} WHERE Nombre = ?`;
    db.query(sql, [nombre], (err, result) => {
      if (err) {
        console.error(`Error deleting from ${entity} by nombre:`, err);
        return res.status(500).send(err);
      }
      res.status(200).send(result);
    });
  });
});

// Endpoint para manejar la solicitud de llenado de mensajes
app.post('/api/mensajes', (req, res) => {
  const { id_cliente, Mensaje, Fecha, Hora } = req.body;
  const sql = 'INSERT INTO mensajes (id_cliente, Mensaje, Fecha, Hora) VALUES (?, ?, ?, ?)';
  db.query(sql, [id_cliente, Mensaje, Fecha, Hora], (err, result) => {
    if (err) {
      console.error('Error inserting into mensajes:', err);
      return res.status(500).send(err);
    }
    res.status(201).json({ message: 'Solicitud de llenado recibida correctamente' });
  });
});

// Endpoint para el login del cliente
app.post('/api/cliente/login', (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).send('Correo y contraseña son requeridos');
  }

  const sql = 'SELECT * FROM cliente WHERE Correo = ? AND Contraseña = ?';
  db.query(sql, [correo, contraseña], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).send('Error en el servidor');
    }

    if (results.length === 0) {
      return res.status(401).send('Credenciales inválidas');
    }

    const user = results[0];

    // Verificar el estado del cliente
    if (user.Estado !== 'Activo') {
      return res.status(403).send('Cuenta inactiva');
    }

    // Eliminar la contraseña antes de enviar la respuesta
    delete user.Contraseña;

    // Devolver el usuario autenticado
    res.status(200).send(user);
  });
});


// Endpoint para el login del empleado
app.post('/api/trabajador/login', (req, res) => {
  const { rfc, contraseña } = req.body;

  if (!rfc || !contraseña) {
    return res.status(400).send('RFC y contraseña son requeridos');
  }

  const sql = 'SELECT * FROM empleado WHERE RFC = ? AND Contraseña = ?';
  db.query(sql, [rfc, contraseña], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(401).send('Credenciales inválidas');
    }

    const user = results[0];

    // Remove the password before sending the response
    delete user.Contraseña;

    res.status(200).send(user);
  });
});

// Endpoint para obtener los datos del tinaco para un cliente específico
// Leer tinacos por id_cliente
app.get('/api/tinaco', (req, res) => {
  const { id_cliente } = req.query;
  if (!id_cliente) {
    return res.status(400).send('id_cliente es requerido');
  }
  const sql = 'SELECT * FROM tinaco WHERE id_cliente = ?';
  db.query(sql, [id_cliente], (err, results) => {
    if (err) {
      console.error('Error reading from tinaco:', err);
      return res.status(500).send(err);
    }
    res.status(200).send(results);
  });
});

// Endpoint para obtener la distancia del sensor ajustada según el nivel de agua
app.get('/api/sensor/distancia', (req, res) => {
  const { id_sensor } = req.query;

  if (!id_sensor) {
    return res.status(400).send('id_sensor es requerido');
  }

  const sql = `
    SELECT s.id_sensor, s.id_tinaco, s.distancia, t.Litros
    FROM sensores s
    JOIN tinaco t ON s.id_tinaco = t.id_cliente
    WHERE s.id_sensor = ?
  `;

  db.query(sql, [id_sensor], (err, results) => {
    if (err) {
      console.error('Error fetching sensor data:', err);
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).send('No se encontraron datos del sensor');
    }

    // Extraer datos
    const { distancia, Litros } = results[0];
    const level = getWaterLevel(Litros); // Obtener nivel de agua basado en litros
    const adjustedDistance = calculateDistance(level); // Calcular distancia ajustada

    res.status(200).json({ ...results[0], distancia: adjustedDistance });
  });
});

// Función para obtener el nivel de agua en porcentaje basado en litros
const getWaterLevel = (litros) => {
  // Suponiendo que el tinaco tiene una capacidad máxima de 100 litros
  return Math.min(Math.max(0, (litros / 100) * 100), 100);
};

// Función para calcular la distancia en función del nivel de agua
const calculateDistance = (level) => {
  let distance = 14; // Distancia inicial en cm

  if (level === 100) {
    return 3; // Distancia para 100% de llenado
  }

  const decrement = 1.1; // Reducción en cm por cada 10%
  const levelDecrement = level / 10; // Cuántos decrementos aplicar

  distance -= decrement * levelDecrement;
  return Math.max(distance, 0); // Asegúrate de que la distancia no sea negativa
};

// Ruta para obtener los datos de consumo
app.get('/api/consumo', (req, res) => {
  const { id_cliente } = req.query;

  if (!id_cliente) {
    return res.status(400).json({ error: 'El ID del cliente es requerido' });
  }

  const sql = `
    SELECT 
      DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
      SUM(distancia) AS consumo
    FROM sensor
    WHERE id_cliente = ?
    GROUP BY DATE_FORMAT(fecha, '%Y-%m-%d')
    ORDER BY fecha;
  `;

  db.query(sql, [id_cliente], (err, results) => {
    if (err) {
      console.error('Error consultando la base de datos:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (!results.length) {
      return res.status(404).json({ error: 'No se encontraron datos' });
    }

    const data = results.map(row => ({
      label: row.fecha,
      value: row.consumo
    }));

    res.json(data);
  });
});



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://10.0.2.2:${port}`);
});
