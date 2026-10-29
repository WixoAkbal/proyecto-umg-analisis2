export class DropdownDto {
	value: number | string;
	description: string;

	constructor(value: string | number, description: string) {
		this.value = value;
		this.description = description;
	}
}