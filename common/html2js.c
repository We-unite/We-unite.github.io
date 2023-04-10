#include <stdio.h>
#include <string.h>
#include <unistd.h>
void html2js(char file_name[])
{
    FILE *html, *js;
    char buf[1024];
    size_t i, len;
    char tmp[30];
    strcpy(tmp, file_name);
    html = fopen(strcat(tmp, ".html"), "r");
    js = fopen(strcat(file_name, ".js"), "w");
    if (html == NULL || js == NULL)
    {
        printf("ERROR:Fail to open file!\n");
        exit(1);
    }
    while (!feof(html))
    {
        memset(buf, '\0', 1024);
        fgets(buf, 1024, html);
        len = strlen(buf);
        fprintf(js, "document.writeln(\"");
        for (i = 0; i < len - 1; i++)
        {
            if (buf[i] == '\"' || buf[i] == '\'')
            {
                fprintf(js, "\\");
            }
            fprintf(js, "%c", buf[i]);
        }
        if (buf[i] != '\n')
        {
            fprintf(js, "%c", buf[i]);
        }
        fprintf(js, "\");\n");
    }
    fclose(html);
    fclose(js);
    printf("Success!\n");
}
int main()
{
    char file_name[30];
    strcpy(file_name, "script4code");
    html2js(file_name);
    strcpy(file_name, "script4works");
    html2js(file_name);
    strcpy(file_name, "script4secret");
    html2js(file_name);
    return 0;
}
