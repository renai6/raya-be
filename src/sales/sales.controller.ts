import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateTransactionDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ActiveSessionGuard } from 'src/auth/active-session-guard';

@UseGuards(JwtAuthGuard, RolesGuard, ActiveSessionGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.salesService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Get(':id')
  findOneByTransaction(@Param('id') id: string) {
    return this.salesService.findOneByTransaction(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
