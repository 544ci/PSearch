using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PSearch.Migrations
{
    public partial class Video1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Video");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Video",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    End = table.Column<TimeSpan>(type: "time", nullable: false),
                    PhoneRefId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Saved = table.Column<bool>(type: "bit", nullable: false),
                    Start = table.Column<TimeSpan>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Video", x => x.Id);
                });
        }
    }
}
