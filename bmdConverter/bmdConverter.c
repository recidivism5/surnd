#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct EString
{
    char* data;
    unsigned int length;
    unsigned int occupied;
} EString;

EString new_estring()
{
    printf("New estring created\n");
    EString e;
    e.length = 16;
    e.occupied = 0;
    e.data = malloc(e.length * sizeof(char));
    return e;
}

void estring_ac(EString* e, char c)
{
    printf("Hi this is estring_ac, and you've just tried to add a character onto an estring of length %i, %i\n", e->length, e->occupied);
    if (e->length == e->occupied)
    {
        e->length *= 2;
        e->data = realloc(e->data, e->length);
    }
    e->data[e->occupied] = c;
    e->occupied++;
}

typedef struct Section
{
    char title[256];
    EString content;
    void* next;
} Section;

typedef struct Document
{
    char title[256];
    Section sections;
} Document;

void make_html(FILE* htmlFptr, Document doc)
{
    fputs("<!DOCTYPE html>\n"
"<html>\n"
"<style>\n"
"\n"
"body {\n"
"\tbackground-color: #0A0B0A;\n"
"    color: #DCE2BD;\n"
"}\n"
"\n"
"div.main { \n"
"  margin-left: 16%;\n"
"  margin-top: 100px;\n"
"  width: 33%;\n"
"}\n"
"\n"
"#sidebar {\n"
"\twidth: 10%;\n"
"    position: fixed;\n"
"    z-index: 1;\n"
"    top: 0;\n"
"    left: 0;\n"
"    background-color: #0A0B0A;\n"
"    overflow-x: hidden;\n"
"    padding-top: 0.5%;\n"
"    padding-left: 2%;\n"
"    color: #DCE2BD;\n"
"    text-decoration: none;\n"
"}\n"
"#sidebar a\n"
"{\n"
"\tcolor: #DCE2BD;\n"
"    text-decoration: none;\n"
"}\n"
"\n"
"h2 {\n"
"\ttext-align: center;\n"
"}\n"
"\n"
"</style>\n"
"<body>\n"
"\n"
"\n"
"\n"
"<div id=\"sidebar\">", htmlFptr);
    fputs("\n   <h1><a href=\"#top\">", htmlFptr);
    fputs(doc.title, htmlFptr);
    fputs("</a></h1>\n", htmlFptr);
    int href = 0;
    char num[256];
    Section* currSect = &(doc.sections);
    if (currSect->next != NULL)
    {
        currSect = currSect->next;
        while (currSect != NULL)
        {
            fputs("<a href=\"#", htmlFptr);
            sprintf(num, "%d", href);
            fputs(num, htmlFptr);
            fputs("\">", htmlFptr);
            fputs(currSect->title, htmlFptr);
            fputs("</a><br>\n", htmlFptr);
            currSect = currSect->next;
            href++;
        }
        fputs("</div>\n<div class=\"main\">\n", htmlFptr);
        currSect = &(doc.sections);
        fputs(currSect->content.data, htmlFptr);
        currSect = currSect->next;
        href = 0;
        while(currSect != NULL)
        {
            fputs("<h2 id=\"", htmlFptr);
            sprintf(num, "%d", href);
            fputs(num, htmlFptr);
            fputs("\">", htmlFptr);
            fputs(currSect->title, htmlFptr);
            fputs("</h2>\n", htmlFptr);
            fputs(currSect->content.data, htmlFptr);
            currSect = currSect->next;
            href++;
        }
        fputs("</div></html>", htmlFptr);
        printf("didn't crash\n");
    }
}

int main(int argc, char** argv)
{
    if (argc < 3)
    {
        printf("Usage: ./bmdConverter example.bmd exampleOutputName.html\n");
        exit(1);
    }
    FILE* bmdFptr = fopen(argv[1], "rb");
    FILE* htmlFptr = fopen(argv[2], "wb");

    

    char c;
    Document doc;
    Section* currSect = &(doc.sections);
    currSect->next = NULL;
    currSect->content = new_estring();
    while (!feof(bmdFptr))
    {
        c = fgetc(bmdFptr);
        if (c == '%')
        {
            c = fgetc(bmdFptr);
            if (c == '%')
            {

            }
            else if (c == 't')
            {
                fgetc(bmdFptr);
                int i = 0;
                c = fgetc(bmdFptr);
                while(c != ']')
                {
                    doc.title[i] = c;
                    c = fgetc(bmdFptr);
                    i++;
                }
                doc.title[i] = '\0';
                c = fgetc(bmdFptr);
            }
            else if (c == 's')
            {
                estring_ac(&(currSect->content), '\0');
                currSect->next = malloc(sizeof(Section));
                currSect = currSect->next;
                currSect->next = NULL;
                currSect->content = new_estring();
                fgetc(bmdFptr);
                int i = 0;
                c = fgetc(bmdFptr);
                while(c != ']')
                {
                    currSect->title[i] = c;
                    c = fgetc(bmdFptr);
                    i++;
                }
                currSect->title[i] = '\0';
                c = fgetc(bmdFptr);
            }
        }
        estring_ac(&(currSect->content), c);
    }

    make_html(htmlFptr, doc);

    fclose(bmdFptr);
    fclose(htmlFptr);
    return(0);

}