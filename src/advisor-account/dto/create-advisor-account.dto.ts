import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateAdvisorAccountDto {
  @IsNotEmpty()
  @IsInt()
  advisorId: number;

  @IsNotEmpty()
  @IsInt()
  accountId: number;
}
