using Microsoft.EntityFrameworkCore.Migrations;

namespace PSearch.Migrations
{
    public partial class final1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EncryptionKey",
                table: "Phone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "enabled",
                table: "Phone",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EncryptionKey",
                table: "Phone");

            migrationBuilder.DropColumn(
                name: "enabled",
                table: "Phone");
        }
    }
}
