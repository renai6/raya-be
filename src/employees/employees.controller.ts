import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  Logger,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateBulkEmployeeDto } from './dto/create-bulk-employee.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ActiveSessionGuard } from 'src/auth/active-session-guard';

@UseGuards(JwtAuthGuard, RolesGuard, ActiveSessionGuard)
@Controller('employees')
export class EmployeesController {
  private readonly logger = new Logger('EmployeesController');
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Post('bulk')
  createBulk(@Body() createBulkEmployeeDto: CreateBulkEmployeeDto) {
    return this.employeesService.createBulk(createBulkEmployeeDto);
  }

  @Get()
  findAll(@Query('page') page: number) {
    return this.employeesService.findAll(page, 10);
  }

  @Get(':id') // Will use employee number as id
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }

  @Get('reports/data')
  async reports(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.employeesService.generateReport(
      new Date(startDate),
      new Date(endDate),
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="employee-report-${Date.now()}.pdf"`,
    );
    res.send(buffer);
  }
}
