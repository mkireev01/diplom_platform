const {Application } = require("../models/models")

class ApplicationController {
    async create(req, res) {
      try {
        const record = await Application.create(req.body);
        return res.status(201).json(record);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }
  
  
    async getAll(req, res) {
      try {
        const list = await Application.findAll();
        return res.json(list);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  
    
    async getOne(req, res) {
      try {
        const { id } = req.params;
        const item = await Application.findByPk(id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        return res.json(item);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  
   
    async update(req, res) {
      try {
        const { id } = req.params;
        const [updated] = await Application.update(req.body, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'Not found' });
        const updatedRecord = await Application.findByPk(id);
        return res.json(updatedRecord);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }
  
    async delete(req, res) {
      try {
        const { id } = req.params;
        const destroyed = await Application.destroy({ where: { id } });
        if (!destroyed) return res.status(404).json({ error: 'Not found' });
        return res.json({ message: 'Deleted' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  }
  
  module.exports = new ApplicationController();