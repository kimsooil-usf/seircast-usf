# Generated by Django 2.2.12 on 2020-05-19 10:13

import datetime
import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('covid', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='state',
            name='abbreviation',
            field=models.CharField(default='FL', max_length=50, verbose_name='Abbreviation'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='state',
            name='country',
            field=models.CharField(default='US', max_length=50, verbose_name='Country'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='state',
            name='default_counties',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=80, verbose_name='County Name'), default=['Hillsborough','Pasco','Pinellas','Polk'], size=8),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='state',
            name='quarantine_percent',
            field=models.PositiveSmallIntegerField(default=0, verbose_name='Percentage Quarantined'),
        ),
        migrations.AddField(
            model_name='state',
            name='quarantine_start_date',
            field=models.DateField(default=datetime.datetime(2020, 8, 1, 0, 0), verbose_name='Quarantine Start Date'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='state',
            name='shelter_date',
            field=models.DateField(default=datetime.datetime(2020, 3, 27, 0, 0), verbose_name='Shelter Date'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='state',
            name='shelter_release_end_date',
            field=models.DateField(default=datetime.datetime(2020, 6, 29, 0, 0), verbose_name='Shelter Release End Date'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='state',
            name='shelter_release_start_date',
            field=models.DateField(default=datetime.datetime(2020, 5, 4, 0, 0), verbose_name='Shelter Release Start Date'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='state',
            name='social_distancing',
            field=models.BooleanField(default=True, verbose_name='Social Distancing'),
        ),
        migrations.AddField(
            model_name='state',
            name='social_distancing_end_date',
            field=models.DateField(default=datetime.datetime(2020, 6, 15, 0, 0), verbose_name='Social Distancing End Date'),
            preserve_default=False,
        ),
    ]
