# Generated by Django 3.2.8 on 2021-11-05 12:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('courses', '0001_initial'),
        ('professors', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Resource',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('resource_name', models.CharField(max_length=21, unique=True)),
                ('resource_group', models.CharField(blank=True, max_length=15, null=True)),
                ('resource_code', models.CharField(max_length=15, null=True, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.course')),
                ('professor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='professors.professor')),
            ],
        ),
    ]
