const {Resume} = require("../models/models")

class ResumeController {
    constructor(Model) {
      this.Model = Model;
    }
  
   
    async create(req, res) {
      try {

        const userId = req.user.id;
  
      
        const payload = {
          ...req.body,
          userId,
        };
  
        const resume = await Resume.create(payload);
        return res.status(201).json(resume);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }
  
 
    async getAll(req, res) {
      try {
        const list = await Resume.findAll();
        return res.json(list);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  
   
    async getOne(req, res) {
      try {
        const { id } = req.params;
        const item = await Resume.findByPk(id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        return res.json(item);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  
    
    async update(req, res) {
      try {
        const { id } = req.params;
        const [updated] = await Resume.update(req.body, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'Not found' });
        const updatedRecord = await this.Model.findByPk(id);
        return res.json(updatedRecord);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }
  
 
    async delete(req, res) {
      try {
        const { id } = req.params;
        const destroyed = await Resume.destroy({ where: { id } });
        if (!destroyed) return res.status(404).json({ error: 'Not found' });
        return res.json({ message: 'Deleted' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  }
  
  module.exports = new ResumeController();