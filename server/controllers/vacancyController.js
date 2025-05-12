const {Vacancy} = require("../models/models")

class VacancyController {
  
    // CREATE
    async create(req, res) {
      try {
        const record = await Vacancy.create(req.body);
        return res.status(201).json(record);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }
  
    // READ all
    async getAll(req, res) {
      try {
        const list = await Vacancy.findAll();
        return res.json(list);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  
    // READ one by ID
    async getOne(req, res) {
      try {
        const { id } = req.params;
        const item = await Vacancy.findByPk(id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        return res.json(item);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  
    // UPDATE by ID
    async update(req, res) {
      try {
        const { id } = req.params;
        const [updated] = await Vacancy.update(req.body, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'Not found' });
        const updatedRecord = await this.Model.findByPk(id);
        return res.json(updatedRecord);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }
  
    // DELETE by ID
    async delete(req, res) {
      try {
        const { id } = req.params;
        const destroyed = await Vacancy.destroy({ where: { id } });
        if (!destroyed) return res.status(404).json({ error: 'Not found' });
        return res.json({ message: 'Deleted' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  }
  
  module.exports = new VacancyController();