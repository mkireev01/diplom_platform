const {Vacancy} = require("../models/models")

class VacancyController {
  

    async create(req, res) {
      try {
        const record = await Vacancy.create(req.body);
        return res.status(201).json(record);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }
  
   
    async getAll(req, res) {
      try {
        const list = await Vacancy.findAll();
        return res.json(list);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  
  
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
  

    async update(req, res) {
      const { id } = req.params;
      const {
        title,
        shortDesc,
        description,
        location,
        jobType,
        salaryFrom,
        salaryTo
      } = req.body;
    
      if (!title || !description) {
        return res.status(400).json({ message: 'Некорректные данные' });
      }
    
      const vacancy = await Vacancy.findByPk(id);
      if (!vacancy) return res.status(404).json({ message: 'Не найдено' });
    
      await vacancy.update({
        title,
        shortDesc,
        description,
        location,
        jobType,
        salaryFrom,
        salaryTo
      });
    
      return res.json(vacancy);
    }
  

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