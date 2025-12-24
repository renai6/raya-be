import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateBulkEmployeeDto } from './dto/create-bulk-employee.dto';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: createEmployeeDto,
    });
  }

  async createBulk(createBulkEmployeeDto: CreateBulkEmployeeDto) {
    return this.prisma.employee.createMany({
      data: createBulkEmployeeDto.employees,
    });
  }

  async findAll(page: number, pageSize: number = 10) {
    let where = {};

    if (page > 0) {
      where = { skip: (page - 1) * pageSize, take: pageSize };
    }

    const now = new Date();
    const currentDay = now.getDate();
    let startDate: Date;
    let endDate: Date;

    if (currentDay <= 15) {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        15,
        23,
        59,
        59,
        999,
      );
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 16);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
    }

    const employees = await this.prisma.employee.findMany({
      ...where,
      include: {
        transactions: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    return employees.map((employee) => ({
      ...employee,
      totalCredit: employee.transactions.reduce(
        (sum, transaction) => sum + transaction.total,
        0,
      ),
    }));
  }

  async findOne(id: string) {
    const now = new Date();
    const currentDay = now.getDate();
    let startDate: Date;
    let endDate: Date;

    if (currentDay <= 15) {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        15,
        23,
        59,
        59,
        999,
      );
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 16);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
    }

    const employee = await this.prisma.employee.findUnique({
      where: { employeeNumber: id },
      include: {
        transactions: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    if (!employee) {
      return {};
    }
    employee['totalCredit'] = employee.transactions.reduce(
      (sum, transaction) => sum + transaction.total,
      0,
    );

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });
  }

  async remove(id: string) {
    return this.prisma.employee.delete({ where: { id } });
  }

  async generateReport(startDate: Date, endDate: Date): Promise<Buffer> {
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    const transactions = await this.prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        employeeId: { not: null },
      },
      orderBy: { employeeId: 'asc' },
      include: {
        employee: {
          select: {
            employeeNumber: true,
            name: true,
            email: true,
            contactNumber: true,
          },
        },
      },
    });

    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(10);
    doc.text(
      'Steel Colors and Metal Products - Canteent Employee Transactions Report',
      15,
      15,
    );
    doc.text(
      `From: ${startDate.toDateString()} To: ${endDate.toDateString()}`,
      15,
      20,
    );

    const data = transactions.map((t) => [
      t.employee?.employeeNumber || '',
      t.employee?.name || '',
      t.total.toString(),
      t.createdAt.toDateString(),
    ]);

    autoTable(doc, {
      headStyles: { fillColor: [22, 160, 133] },
      head: [['Employee Number', 'Name', 'Total', 'Date']],
      body: data,
      startY: 25,
      columnStyles: {
        0: { cellWidth: 40 }, // Employee Number
        1: { cellWidth: 80 }, // Name
        2: { cellWidth: 30 }, // Total
        3: { cellWidth: 40 }, // Date
      },
    });

    const buffer = doc.output('arraybuffer');
    return Buffer.from(buffer);
  }
}
