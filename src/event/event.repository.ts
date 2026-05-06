import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, Repository } from 'typeorm';

import { Event } from './event.entity';
import { CreateEventDto } from './dto/event.dto';

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly repo: Repository<Event>,
  ) {}

  // event.repository.ts
  async createEvent(dto: CreateEventDto, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Event) : this.repo;
    return repo.save(dto);
  }
}
