import { DynamicModule, Module } from '@nestjs/common';
import { SymDefaultConfig, SymMaxConLimit } from './constant';
import { TypeOrmConfig } from './typeorm-config';

@Module({
  providers: [TypeOrmConfig],
  exports: [TypeOrmConfig],
})
export class TypeormConfigModule {
  static register(defaultConfig = 'default', maxConLimit = 2): DynamicModule {
    return {
      module: TypeormConfigModule,
      providers: [
        { provide: SymMaxConLimit, useValue: maxConLimit },
        { provide: SymDefaultConfig, useValue: defaultConfig },
      ],
    };
  }
}
