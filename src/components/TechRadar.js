// src/components/TechRadar.js

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Modal, Button, Select, Input, message } from 'antd';
import { useSelector } from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import './TechRadar.css'; // Импортируем стили для компонента

const { Option } = Select;

const TechRadar = ({ technologies = [] }) => {
  const svgRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false); // Изменено на isModalOpen
  const [selectedTech, setSelectedTech] = useState(null);
  const [filters, setFilters] = useState({ ring: 'All', quadrant: 'All' });
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleFilterChange = (value, type) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const filteredTechnologies = technologies.filter((tech) => {
    const ringMatch = filters.ring === 'All' || tech.rang === filters.ring;
    const quadrantMatch =
      filters.quadrant === 'All' || tech.technologyType === filters.quadrant;
    const nameMatch = tech.name.toLowerCase().includes(searchTerm.toLowerCase());
    return ringMatch && quadrantMatch && nameMatch;
  });

  useEffect(() => {
    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll('*').remove();

    const width = Math.min(window.innerWidth, 800); // Адаптивный размер
    const height = width;
    const radius = Math.min(width, height) / 2;
    const svg = svgElement
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const rings = ['ADOPT', 'TRIAL', 'ASSESS', 'HOLD'];
    const quadrants = ['LANGUAGE', 'TOOLS', 'TECHNIQUES', 'PLATFORMS'];
    const ringRadius = radius / rings.length;

    const ringColors = {
      ADOPT: '#73c619',
      TRIAL: '#0ab4ff',
      ASSESS: '#fddc00',
      HOLD: '#f17b72',
    };

    // Отрисовка колец
    rings.forEach((ring, i) => {
      svg
        .append('circle')
        .attr('r', ringRadius * (i + 1))
        .attr('fill', 'none')
        .attr('stroke', '#ccc');

      svg
        .append('text')
        .attr('y', -ringRadius * (i + 1) + 30)
        .attr('text-anchor', 'middle')
        .style('font-size', '24px')
        .style('fill', `${ringColors[ring]}99`)
        .style('font-weight', 'bold')
        .text(ring);
    });

    // Отрисовка квадрантов
    quadrants.forEach((quadrant, i) => {
      svg
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', radius * Math.cos((Math.PI / 2) * i))
        .attr('y2', radius * Math.sin((Math.PI / 2) * i))
        .attr('stroke', '#ccc');

      svg
        .append('text')
        .attr(
          'x',
          (radius - 60) * Math.cos((Math.PI / 2) * (i + 0.5))
        )
        .attr(
          'y',
          (radius - 60) * Math.sin((Math.PI / 2) * (i + 0.5))
        )
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', '#555')
        .text(quadrant);
    });

    // Получаем максимальное количество голосов для нормализации
    const maxVotes = Math.max(...filteredTechnologies.map((t) => t.votes || 0), 1);

    // Размещение технологий
    filteredTechnologies.forEach((tech) => {
      const angle =
        (quadrants.indexOf(tech.technologyType) * Math.PI) / 2 +
        Math.random() * (Math.PI / 2);
      const ringIndex = rings.indexOf(tech.rang);

      // Используем количество голосов для изменения расстояния
      // Чем больше голосов, тем ближе к центру
      const voteFactor = tech.votes ? (maxVotes - tech.votes) / maxVotes : 1;
      const distance =
        (ringIndex + 0.5 + voteFactor * 0.5) * ringRadius;

      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      // Кружок технологии
      svg
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 5)
        .attr('fill', ringColors[tech.rang])
        .on('click', () => {
          setSelectedTech(tech);
          setIsModalOpen(true); // Изменено на setIsModalOpen
        });

      // Название технологии
      svg
        .append('text')
        .attr('x', x)
        .attr('y', y - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', '#000')
        .text(tech.name);
    });
  }, [filteredTechnologies]);

  const handleVote = async (techId) => {
    try {
      const response = await axiosInstance.post('/vote', { technologyId: techId });
      if (response.status === 200) {
        message.success('Ваш голос учтен');
        // Здесь можно обновить данные технологий
        // Например, повторно вызвать функцию для получения технологий
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error('Вы уже голосовали за эту технологию');
      } else {
        message.error('Ошибка при голосовании');
      }
    }
  };

  return (
    <>
      <div className="filters-container">
        <Input
          placeholder="Поиск по названию"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
        <Select
          defaultValue="All"
          onChange={(value) => handleFilterChange(value, 'ring')}
          className="filter-select"
        >
          <Option value="All">Все кольца</Option>
          <Option value="ADOPT">ADOPT</Option>
          <Option value="TRIAL">TRIAL</Option>
          <Option value="ASSESS">ASSESS</Option>
          <Option value="HOLD">HOLD</Option>
        </Select>
        <Select
          defaultValue="All"
          onChange={(value) => handleFilterChange(value, 'quadrant')}
          className="filter-select"
        >
          <Option value="All">Все категории</Option>
          <Option value="LANGUAGE">LANGUAGE</Option>
          <Option value="TOOLS">TOOLS</Option>
          <Option value="TECHNIQUES">TECHNIQUES</Option>
          <Option value="PLATFORMS">PLATFORMS</Option>
        </Select>
      </div>
      <div className="radar-container">
        <svg ref={svgRef}></svg>
      </div>
      <Modal
        title={selectedTech ? selectedTech.name : ''}
        open={isModalOpen} // Изменено с visible на open
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedTech && (
          <div>
            <p>
              <strong>Категория:</strong> {selectedTech.technologyType}
            </p>
            <p>
              <strong>Кольцо:</strong> {selectedTech.rang}
            </p>
            <p>
              <strong>Версия:</strong> {selectedTech.version}
            </p>
            <p>
              <strong>Голосов:</strong> {selectedTech.votes || 0}
            </p>
            <p>
              <strong>Ссылка:</strong>{' '}
              <a href={selectedTech.link} target="_blank" rel="noopener noreferrer">
                {selectedTech.link}
              </a>
            </p>
            {isAuthenticated && (
              <Button
                type="primary"
                onClick={() => handleVote(selectedTech.id)}
                style={{ marginTop: '20px' }}
              >
                Проголосовать
              </Button>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default TechRadar;
