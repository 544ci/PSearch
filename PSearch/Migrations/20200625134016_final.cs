using Microsoft.EntityFrameworkCore.Migrations;

namespace PSearch.Migrations
{
    public partial class final : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PhoneRefId",
                table: "Video",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Video_PhoneRefId",
                table: "Video",
                column: "PhoneRefId");

            migrationBuilder.AddForeignKey(
                name: "FK_Video_Phone_PhoneRefId",
                table: "Video",
                column: "PhoneRefId",
                principalTable: "Phone",
                principalColumn: "DeviceId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Video_Phone_PhoneRefId",
                table: "Video");

            migrationBuilder.DropIndex(
                name: "IX_Video_PhoneRefId",
                table: "Video");

            migrationBuilder.AlterColumn<string>(
                name: "PhoneRefId",
                table: "Video",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string));
        }
    }
}
